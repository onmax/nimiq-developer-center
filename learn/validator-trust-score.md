# Nimiq's Validator Trust Score

An algorithm that calculates a score to help users assess how reliable a validator is. {.subline}

We will use this score to display in the Nimiq wallet to help users decide which validator to trust.

The score ranges from 0 to 1, where 0 means not trustworthy at all and 1 means highly trustworthy.

<figure>

<img src="/assets/images/learn/validators-trust-score-wallet-preview.png" alt="The Validator Trust Score in the Wallet" max-h-512 object-contain />

<figcaption>

Preview of the Validator Trust Score in the Nimiq Wallet

</figcaption>

</figure>

## Open source

The algorithm, like the blockchain itself, will be open source, including both its design and implementation.

The implementation is currently under development and will be available as an `npm` library.

In addition, an API *may* be publicly available for anyone to use, allowing access to the score. We will be sharing more information about this API in the future.

## The VTS algorithm

The algorithm is a product of three factors: Size, Liveness and Reliability, each ranging from 0 to 1.

$$
T = S \times L \times R
$$

The Size factor depends solely on the current distribution of bets. Conversely, the Reliability and Liveness scores are based on their behaviour over the last 9 months, which we believe is a sufficient period to evaluate a validator. Behaviour older than 9 months is excluded from the score calculation.

We only consider completed epochs, not the currently active epoch. Therefore, the score is not a live value. It can have a delay of +12 hours (an epoch last 12 hours).

Before moving forward, we will define $m$, which is the number of epochs to consider knowing that the window duration is 9 months.

<details>

<summary children:mx-0>

Calculation of $m$

</summary>

$$
m = \frac{\text{window\_duration\_ms}}{\text{epoch\_duration}}
$$

$$
$\text{window\_duration\_ms} = 9 \times 30 \times 24 \times 60 \times 60 \times 1000$.
$$

$$
$\text{epoch\_duration} = \text{block\_duration} \times \text{blocks\_per\_epoch}
$$

  - Block duration and blocks per epoch are constants from the [policy](https://github.com/nimiq/core-rs-albatross/blob/albatross/primitives/src/policy.rs)

</details>

Let's look at how each parameter is calculated:

### Size

The size factor penalises validators who control too much of the network's share.

We define the size $s$ of a validator as the fraction of the total stake it controls. The size factor is calculated as

$$
S = \max \left( 0 , 1 - \left( \frac{s}{t} \right)^{k} \right), \quad \text{being } t = 0.25 \text{ and } k=4
$$

Where $t$ is the threshold and $k$ is the slope of the curve

<figure mb-16>

<iframe src="https://www.desmos.com/calculator/89yvaeqxff?embed" aspect-video frameborder="0" allowfullscreen></iframe>

<figcaption>

Graph of the size factor. The x-axis represents the size of the validator, and the y-axis represents the size factor.

</figcaption>

</figure>

For example:

- A validator with a size of 0.1 would have a size factor of $0.974$.
- A validator with a size of 0.15 would have a size factor of $0.87$.

<Callout type="info" no-title>

Due to technical limitations, we can currently only calculate the size of validators active in the current epoch. We cannot calculate the score of a validator in a given timestamp.

</Callout>

### Liveliness

The liveness factor penalises validators that are not selected to produce blocks and encourages validators to be selected.

The score is a moving average of the liveness score for each epoch. First, we calculate the liveness($l_i$) for each epoch.

<Callout type="info" no-title>

Take the number of epochs in which the validator was selected and divide by the number of epochs.

</Callout>

$$
[ l_i = \frac{\text{produced}_i}{\text{likelihood}_i}, \quad \text{for } i = 0, 1, 2, \ldots, m-1 ]
$$

where $l_0$ is the liveness value of the most recent epoch and $l_{m-1}$ is the liveness of the oldest epoch.

To combine all the liveness scores into a single value, we do a moving average, where more recent epochs have higher weights than older ones.

$$

\bar{L} = \frac{\sum_{i=0}^{m-1} \left( 1-a\frac{i}{m-1} \right) l_i}{\sum_{i=0}^{m-1} \left( 1-a\frac{i}{m-1} \right)}, \quad a = 0.5

$$

Being $a$, the parameter determining how much the observation of the oldest epoch is worth relative to the observation of the newest epoch.

#### Adaptation to support smaller validators

To better support smaller validators in our PoS network, we use a curve to represent the value of the previous step. This adjustment aims to reduce the penalty for validators who are not frequently selected for block production, while still incentivising active participation.

The adjusted liveness score is calculated using the following formula:

$$
L=-\bar{L}^{2}+2\bar{L}
$$

<figure>

<iframe src="https://www.desmos.com/calculator/oipaneynho?embed" aspect-video frameborder="0" allowfullscreen></iframe>

<figcaption>

Graph of the liveness score adjustment. The x-axis represents the liveness score, and the y-axis represents the adjusted liveness score.

</figcaption>

</figure>

### Reliability

The Reliability factor penalizes validators that inconsistently produce blocks when expected, assessing their active contribution to the network.

The score is a moving average of the reliability score for each epoch. First, we calculate the reliability($r_i$) for each epoch.

<Callout type="info" no-title>

We take the number of blocks that the validator produced and received a reward for and divide it by the number of blocks that the validator was likely to produce.

</Callout>

<details>

<summary children:m-0>

Details on how to calculate the $r_i$

</summary>

The number of blocks that the validators produced can be fetched from the blockchain via the inherents of a batch. We will refer to these value as $b_j$, where $j \in [0, B]$. $B$ is the number of batches in an epoch.

Figuring out how many blocks a validator is likely to produce is a bit trickier. In each voting block we can see the slot distribution for the next epoch. Basically, there will be a value from 1 to 512 for each active validator. A value of 1 means that the validator is likely to make 1 out of 512 blocks, while a value of 512 means that the validator is likely to make all the blocks. We need to convert this number into a probability, a value between 0 and 1.

Here, $s_j$ is the slot distribution value for the batch $j$. This value tells us the probability that a validator will produce a block in that batch.

</details>

$$
r_i = \frac{\sum_{j=0}^{B} b_j}{\sum_{j=0}^{B} s_i}
$$

where $l_0$ is the liveness value of the most recent epoch and $l_{m-1}$ is the liveness of the oldest epoch.

To combine all the liveness scores into a single value, we do a moving average, where more recent epochs have higher weights than older ones.

$$

\bar{L} = \frac{\sum_{i=0}^{m-1} \left( 1-a\frac{i}{m-1} \right) l_i}{\sum_{i=0}^{m-1} \left( 1-a\frac{i}{m-1} \right)}, \quad a = 0.5

$$

Being $a$, the parameter determining how much the observation of the oldest epoch is worth relative to the observation of the newest epoch.

#### Adjusting for High-Reliability Expectations

The previous formula provides a weighted moving average score for server reliability in block production, where a score of $0.9$ indicates a significant downtime of 10%, highlighting recent performance and the need for improved consistency.

As one block is missing, this is a significant shortfall. To better reflect the high standards required, we will plot the value on a circle, having $c$ as the parameter defining the slope of the arc.

$$
R=-c+1-\sqrt{-\bar{R}^{2}+2c\bar{R}+\left(c-1\right)^{2}}
$$

$$
\text{Center of circle at (c,-c+1), where }
c=-0.16
$$

<figure>

<iframe src="https://www.desmos.com/calculator/zqemsh7yay?embed" aspect-video frameborder="0" allowfullscreen></iframe>

<figcaption>

Graph of the reliability score adjustment. The x-axis represents the reliability score, and the y-axis represents the adjusted reliability score.

</figcaption>

</figure>

## Suggestions & Feedback

Like everything in Nimiq, this algorithm is designed for people. We know it is not perfect and we may have missed some details. If you have any feedback or suggestions that you think will improve the algorithm, please feel free to contact us by [opening an issue](https://github.com/nimiq/developer-center/issues?q=is:issue+is:open+sort:updated-desc) or in the [Telegram group](https://t.me/joinchat/AAAAAEJW-ozFwo7Er9jpHw).
