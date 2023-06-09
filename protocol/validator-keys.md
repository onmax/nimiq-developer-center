# Validator keys

A key pair consists of a public key and a private key, mathematically linked to each other. A private key authenticates a signer's address, and the public key allows a user to verify the signer's authenticity. Each address in Nimiq’s blockchain has an associated key. In the protocol, different keys are used to sign different types of transactions.

<br/>

As with all blockchain users, validators need keys to interact with the network. Once a user proposes to validate blocks and stake their coins, three sets of keys are generated:

- The corresponding key to the validator's address.
- A signing key - Schnorr signature scheme.
- A voting key - BLS signature scheme.

<br/>

### BLS (Boneh–Lynn–Shacham)

The BLS signature scheme uses a key pair to sign and verify messages. This signature scheme generates short signatures. We use the [BLS](https://en.wikipedia.org/wiki/BLS_digital_signature) signature scheme for signature aggregation, combining _n_ signatures into a single one. To aggregate multiple signatures on the same message, validators calculate their public keys combined and the message. Then, all signatures are aggregated into a single one by summing all up. Therefore, we obtain a single signature and a single public key, saving substantial space.

<br/>

### Schnorr keys

Albatross uses the [ed25519](https://ed25519.cr.yp.to/) algorithm to generate [Schnorr](https://en.wikipedia.org/wiki/Schnorr_signature) key pairs to sign and verify messages. This signature scheme allows short and simple signatures, which are also easy to verify. They have a simple setup, allowing a fast way to validate transactions. Thus, when a validator signs a transaction, the rest of the validator list can easily verify the transaction. The validator signs the transaction, given its signing private key and the message. Then, the transaction can be verified with the validator’s signature, message, and public key.

<br/>

### Validator keys

**Address**

Validators use their address corresponding key to:

- Sign transactions.
- Create, update and drop the validator in the [staking contract](staking-contract.md).

<br/>

**Signing key**

Validators use this key pair to:

- Sign micro blocks.
- Sign fork proofs.
- Sign the macro block proposal from its proposer.
- Generate the [VRF](verifiable-random-functions.md) seed for the random seed present in every block.
- Retire, reactivate and unpark the validator in the staking contract.

<br/>

**Voting key**

Validators use this key pair to:

- Vote for a skip block.
- Vote for macro block proposals following the Tendermint protocol.

<br/>

Although both signature schemes generate short signatures, Albatross only uses the BLS signature scheme to aggregate signatures. As voting for [TODO](https://nimiq.com)'s proposals and skip blocks requires multiple validators to sign, we opted for the BLS signature scheme to aggregate all validator’s signatures into one. This aggregation decreases the amount of space in storage that multiple signatures consist of.

<br/>

The reason for the three sets of keys is due to operational security. The key corresponding to the validator’s address is immutable, while the signing and voting keys are mutable, and validators can change them by sending an update message.
