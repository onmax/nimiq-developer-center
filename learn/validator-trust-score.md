# Nimiq's Validator Trust Score

An algorithm that calculates a score to help users assess how reliable a validator is.{.subline .mb-32}

The Validator Trust Score (VTS) algorithm is designed to help users assess the reliability of validators in the Nimiq Wallet. This score ranges from 0 to 1, where 0 indicates a validator is not trustworthy, and 1 indicates a highly trustworthy validator. This way, stakers can make better informed decisions about which validators to trust. The VTS algorithm is based on three key factors:

- **Size**: Evaluates the size of the validator's stake relative to the total stake in the network, penalizing validators with higher stakes to prevent centralization.
- **Reliability**: Assesses the consistency of a validator in producing blocks over the past 9 months.
- **Liveness**: Measures how often a validator is online and selected to produce blocks.

<div my-64 rounded-6 bg-orange-400 bg-op-50 text="[#E07802]" px-24 py-16 ring="1.5 orange-600" relative of-hidden class="raw">
  <div flex="~ items-center gap-12" text-18 font-bold mb-8>
    <div i-nimiq:bell text-16 op-70 />
    Heads up
  </div>
  <p pr-32 md:pr-64>
    The Validator Trust Score is still under heavy development and nothing is final. Feel free to share your <a href="#suggestions-feedback" underline text-inherit>Suggestions or Feedback</a>.
  </p>
  <div i-custom:crane absolute text-90 md:text-128 right--12 bottom--16 md:top-6 rotate-y-180 op-20 pointer-events-none />
</div>

<figure>

<img src="/assets/images/learn/validators-trust-score-wallet-preview.png" alt="The Validator Trust Score in the Wallet" max-h-512 object-contain />

<figcaption>

Preview of the Validator Trust Score in the Nimiq Wallet

</figcaption>

</figure>

---

The VTS algorithm is open source, with its design and implementation available to the public, just like our blockchain. The implementation is currently under development and will be available as an `npm` package. An API may also be made available for public use to access the score. More information about this API will be provided in the future. This document details the calculation methods for each factor.

## The VTS algorithm

The algorithm uses three factors: **S**ize, **R**eliability, and **L**iveness. Each factor ranges from 0 to 1.

$$
T = S \times R \times L
$$

The Size factor is based on the size of the validator's stake relative to the total stake in the network. Reliability and Liveness are based on behaviour over the last 9 months. For these parameters we only consider completed epochs, not the currently active one. Therefore, the score is not live and can have a delay of up to 12 hours (an epoch lasts 12 hours).

Before going any further, we define $m$, the number of epochs to consider, knowing that the duration of the window is 9 months.

<details>

<summary children:mx-0>

Calculation of $m$

</summary>

$$
m = \frac{\text{window\_duration\_ms}}{\text{epoch\_duration}}
$$

$$
\text{window\_duration\_ms} = 9 \times 30 \times 24 \times 60 \times 60 \times 1000
$$

$$
\text{epoch\_duration} = \text{block\_duration} \times \text{blocks\_per\_epoch}
$$

  - Block duration and blocks per epoch are constants from the [policy](https://github.com/nimiq/core-rs-albatross/blob/albatross/primitives/src/policy.rs)

</details>

<Callout type="info" no-title>

The curves and constants presented in this document are subject to change at any time in the future. We will keep the community informed of any changes.

</Callout>

### Size

The Size factor ensures that no single validator controls too much of the network's total stake. If a validator controls a large portion of the total stake, they will get a lower score. We penalize validators with a higher stake compared to those with a lower stake, as a lower stake promotes a fair distribution of control across the network.

First, we calculate the stake percentage ($s$) of the validator in the network:

$$
s = \frac{v}{Z}
$$

Where $v$ is the validator's stake and $Z$ is the total stake in the network.

Then, we apply a curve to the stake percentage to calculate the Size score ($S$):

$$
S = \max \left( 0 , 1 - s^{k} \right), \quad \text{being } t = 0.25 \text{ and } k=4
$$

Where $t$ is the threshold and $k$ is the slope of the curve.

<figure mb-16>

<iframe src="https://www.desmos.com/calculator/89yvaeqxff?embed" aspect-video frameborder="0" allowfullscreen></iframe>

<figcaption>

Graph of the size factor. The x-axis represents the size of the validator, and the y-axis represents the size factor.

</figcaption>

</figure>

Here you can see some examples depending on the stake percentage:

| Stake Percentage | Size Score  |
| ---------------- | ----------- |
| 0%               | 1           |
| 5%               | 0.998       |
| 10%              | 0.974       |
| 15%              | 0.87        |
| 20%              | 0.59        |
| >=25%            | 0           |

<Callout type="info" no-title>

Due to technical limitations, we can currently only calculate the size of validators that are active in the current epoch. We cannot calculate the score of a validator at a given timestamp.

</Callout>

### Reliability

The Reliability factor measures how consistent a validator is when it comes to producing blocks when they should. Validators who regularly produce the blocks they are expected to will have a high reliability score. On the other hand, validators who often fail to produce their expected blocks will have a lower reliability score. The score is a moving average of the reliability score for each epoch. First, we calculate the reliability ($r_i$) for each epoch.

<Callout type="info" no-title>

$r_i$ is the number of blocks that the validator produced and received a reward for ($C_i$) divided by the number of blocks that the validator was likely to produce ($H_i$).

</Callout>

<details>

<summary children:m-0>

Calculation of $C_i$

</summary>

$C_i$ rewarded blocks (and thus produced) by a validator in the epoch $i$:

$$
C_i = \sum_{j=0}^{N-1} c_j \quad \text{for } i = 0, 1, 2, \ldots, m-1
$$

$c_j$ is the number of blocks that the validator produced in the batch $j$, where $j \in [0, N-1]$.

- $N$ is the number of batches in an epoch that can be retrieved from the [policy](htts://github.com/nimiq/core-rs-albatross/blob/albatross/primitives/src/policy.rs).
- The number of blocks that the validators produced can be fetched from the blockchain via the rewarded inherent of a batch.

</details>

<details>

<summary children:m-0>

Calculation of $H_i$

</summary>

$H_i$ is the likelihood that a validator will produce a block in the epoch $i$:

$$
H_i = \frac{h_{i,v}}{\sum_{k=0}^{V-1} h_{i,v}} \quad \text{for } i = 0, 1, 2, \ldots, m-1
$$

- $V$ is the number of active validators in the epoch $i$.
- $h_{i,v}$ is the assignated slot number for the validator $v$ in the epoch $i$.

</details>

$$
r_i = \frac{C_i}{H_i}, \quad \text{for } i = 0, 1, 2, \ldots, m-1
$$

Where $r_0$ is the Reliability value of the most recent epoch and $r_{m-1}$ is the Reliability of the oldest epoch.

To combine all the Reliability scores into a single value, we do a moving average, where more recent epochs have higher weights than older ones.

$$
\bar{R} = \frac{\sum_{i=0}^{m-1} \left( 1-a\frac{i}{m-1} \right) r_i}{\sum_{i=0}^{m-1} \left( 1-a\frac{i}{m-1} \right)}, \quad a = 0.5
$$

Being $a$, the parameter determining how much the observation of the oldest epoch is worth relative to the observation of the newest epoch.

#### Adjusting for High-Reliability Expectations

The previous formula provides a weighted moving average score for validators reliability in block production, where a score of $0.9$ indicates a significant downtime of 10%[*](#notice-0.9), highlighting recent performance and the need for improved consistency.

To better reflect the high standards required, we will plot the value on a circle, with $c$ as the parameter defining the slope of the arc.

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

What we achieve with this adjustment is to penalise more severely those validators that have a low reliability score and are unable to produce blocks when expected.

<small text-12 id="notice-0.9">
* Using 10% is only a heavy approximation. The value of $0.9 could represent 10% downtime, but also 20% or 5%, depending on when the downtime occurred. We say 10% to help the reader understand the scale of the score.
</small>

### Liveliness

The Liveness factor measures how often a validator is online and selected to produce blocks. We want validators to be active because it ensures the network runs smoothly and securely. Validators that are frequently online and producing blocks receive a higher score, promoting consistent participation and reliability.

#### Why Liveness

If a validator is not active and producing blocks, it could still have a high Size and Reliability score. This would be misleading because they are not contributing to the operation of the network. The Liveness factor ensures that only active validators that are actually selected to produce blocks receive a higher score. We want to penalise validators that are not selected to produce blocks because they are inactive, jailed, offline, etc.

We use the term _liveness_ instead of _uptime_ because _uptime_ implies precise measurement, as in server contexts where you can measure online time. In our case, we can't measure how long a validator has been online. We can only see when validators are active and producing blocks. There's no way of telling when they're active but not producing blocks, or when they're offline.

To be clear, a validator can be active and offline at the same time. It could be offline and not producing blocks because it's offline, or it could be active but not producing blocks because it hasn't been selected in a certain period. This is why we use _liveness_ to show how often a validator is selected to produce blocks.

#### How to calculate Liveness

The score is a moving average of the liveness score for each epoch. First, we calculate the liveness ($l_i$) for each epoch.

<Callout type="info" no-title>

Take the number of epochs in which the validator was selected and divide by the number of epochs.

</Callout>

$$
l_i =
\begin{cases}
1 & \text{if validator was selected in epoch } i \\
0 & \text{otherwise}
\end{cases} \quad \text{for } i = 0, 1, 2, \ldots, m-1
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

## Suggestions & Feedback

Like everything in Nimiq, this algorithm is designed for people. We know it is not perfect and we may have missed some details. If you have any feedback or suggestions that you think will improve the algorithm, please feel free to contact us by [opening an issue](https://github.com/nimiq/developer-center/issues?q=is:issue+is:open+sort:updated-desc) or in the [Telegram group](https://t.me/joinchat/AAAAAEJW-ozFwo7Er9jpHw).
