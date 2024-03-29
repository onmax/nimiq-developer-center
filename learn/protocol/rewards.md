# Rewards

In PoS blockchains, validators who follow the consensus rules are rewarded for their effort. In Nimiq Proof-of-Stake, validators stake NIM to participate in the consensus and they are incentivized to validate blocks according to the consensus in order to earn rewards, thus more NIM.

Validators receive rewards proportionally to their stake; hence, validators who have deposited a higher amount of NIM into the staking contract will receive higher rewards than validators who have staked a lower amount of NIM.

Stakers can delegate NIM to validators to increase the validator’s stake and, therefore, increase the rewards to receive. Unlike validators, stakers don’t receive the rewards on-chain. Instead, validators distribute the staker’s portion of the rewards off-chain.

Validators that don’t follow the consensus get their rewards burned. Delaying the block production or attempting to create a split in the chain are considered bad behaviors and always result in a reduction of the rewards to receive.

Our protocol distributes the rewards with a batch of delay to account for malicious validators. Validators have a window of a batch to submit a fork proof, as the reward distribution considers misbehaviors. Malicious validators are punished for creating a fork or continuing to produce on a fork, which results in losing the rewards of the respective batch. There is a delay of one batch, which is enough to consider fork proofs to burn the malicious validators' rewards.

## Reward distribution

The rewards are equally divided among the validator list. Hence, the reward is evenly divided among all the slots. The validator list comprises 512 slots, and a validator can own one or multiple ones. A validator that holds 50 slots will receive a higher reward than a validator that holds 15 slots in a proportionally way. Moreover, a validator that misbehaves will have its rewards burned.

The following illustration serves for visualization purposes only. Validators that produce blocks during batch 1 receive their rewards at the end of batch 2, thus macro block H; validators that produce blocks during batch 2 receive their rewards at the end of batch 3, thus macro block L, and so on.

![rewards distribution.drawio.png](/assets/images/protocol//rewards_distribution.png)

## Reward calculation

The rewards consist of the coinbase and the transaction fees. The coinbase is the number of new coins printed at the end of every batch, and the transaction fees are the sum of all transaction fees from a batch.

Both the coinbase and transaction fees are variable. Whereas, in Bitcoin, for instance, the coinbase remains the same for each block produced and decreases by approximately 50% every 4 years. Our coinbase varies on a time base as new coins are printed per batch rather than per block.

To calculate the coinbase, we have a formula that predicts the supply at any given time, given three parameters:

- Initial supply: the supply that Nimiq PoS will start with, denoted by *S₀*
- Initial velocity: a constant parameter that determines the number of NIM created initially by unit of time represented by *V₀*
- Decay: a constant that dictates the percentage of the velocity decrease, denoted by β

The supply formula is the following:

$S(t)=S_0+\frac{V_0}{\beta}(1-e^{-\beta t})$

Additionally, 𝑡 is the time elapsed since the genesis block, and *e* is the exponential function. The formula is hard-coded and returns the supply of the coinbase at any given time in seconds, and it is distributed in Lunas (1 NIM = 100 000 Lunas).

Essentially, the coinbase is calculated by subtracting the supply calculated in the blockchain at any given time from the previous supply, which is the total amount of NIM at the end of the last batch. This is calculated at the exact moment the reward is distributed. For a detailed explanation of the supply formula to calculate the coinbase, supply formula click here.
