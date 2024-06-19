# Establishing Consensus

## Overview

- Nimiq is a censorship-resistant, privacy-oriented, and decentralized blockchain-based payment protocol
- A blockchain is a shared digital ledger that is kept up-to-date across all users in the network through a process called establishing consensus
- Compared to most other blockchain systems, it allows a direct connection to the network using a light node
- These light nodes use Zero Knowledge Proofs (ZKPs) to efficiently verify blockchain transactions and states

## Learning

Nimiq is a blockchain-based payment protocol. This technology offers several key benefits:

- **Censorship-resistant:** No one can prevent you from using it
- **Privacy-oriented:** You don’t need to provide any personal information to open an account
- **Decentralized:** It’s not controlled by any single person but by all its users

A blockchain is like a shared digital ledger. Keeping this ledger up to date across all users in the network is called establishing consensus. Traditionally, most blockchain systems require you to connect through a third party to avoid downloading the entire blockchain, which can be over 100 GB in size. This approach necessitates trusting the third party.

Nimiq, however, allows direct connection to the network using a light node. Unlike full nodes, which download and verify the entire blockchain, light nodes only download a small portion of it. They rely on full nodes to provide the necessary information to verify transactions. This approach significantly reduces storage and computational requirements, making light nodes ideal for devices with limited resources, such as browsers or mobile devices.

In Nimiq, these light nodes use Zero Knowledge Proofs (ZKPs) to efficiently verify blockchain transactions and states, providing a secure and user-friendly experience.

<div dark:bg-gray-300 bg-gray-100 p-16 my-48 rounded-6>
    <img class="object-contain max-h-[max(80vh,220px)]" src="/assets/images/tutorials/nimiq-network.svg" alt="Illustration of the nimiq network compared to most other blockchains" />
</div>

### Using `@nimiq/core` to Establish Consensus

You have the option to interact with the Nimiq blockchain using either a web browser or Node.js, through the `@nimiq/core` npm module. Begin by setting up your project as usual, then install the module using npm.

```bash
npm install @nimiq/core@next
```

In order to connect to the network and establish consensus, you need to import the Nimiq Web package and configure the client.

```js
const Nimiq = require('@nimiq/core')
```

- To create a client configuration, use the `ClientConfiguration()` constructor
- To configure the client to use the Nimiq Testnet use `config.network('TestAlbatross')`
- To create an instance of the Client call `Client.create(config.build())`

```js
const config = new Nimiq.ClientConfiguration() // Create a configuration builder
config.network('TestAlbatross') // Select Testnet
const client = await Nimiq.Client.create(config.build()) // Instantiate and launch the client
```

These three lines are all you need to connect to the network and establish consensus. All you have to do is wait until the consensus is established. You can check the consensus state by calling `isConsensusEstablished()` which returns `true` if consesus is established.

```js
const consensus = await client.isConsensusEstablished()
```

Great! You just learned how to configure a client and establish consensus. Now let's practice what you just learned!

## Practice

Create a new directory and the `@nimiq/core` package:

```
mkdir nimiq-2-0-tutorial
cd nimiq-2-0-tutorial
npm init -y
npm install @nimiq/core@next
```

Create a new file `index.js` and configure the client:

```js
const Nimiq = require('@nimiq/core')

async function main() {
  const config = new Nimiq.ClientConfiguration() // Create a configuration builder
  config.network('TestAlbatross') // Select Testnet
  const client = await Nimiq.Client.create(config.build()) // Instantiate and launch the client

  setInterval(async () => {
    const consensus = await client.isConsensusEstablished()
    console.log(`${consensus ? '✅ Consensus Established!' : '⏳ Consensus not (yet) established ...'}`)
  }, 2000)
}

main()
```

When you run `node index.js`, you should see a bunch of outputs, including those we implemented in the code above:

```
> [... logs of the client ...]
> ⏳ Consensus not (yet) established ...
> [... logs of the client ...]
> ✅ Consensus Established!
```

You’ve now created a simple Node.js application that uses the `@nimiq/core` package to connect to the Nimiq test network and establish consensus. In the next tutorial, you will learn how to create a Nimiq wallet.

---

## Completed the Tutorial?

[Share your achievement on Twitter](https://twitter.com/intent/tweet?text=I%20just%20learned%20how%20to%20establish%20consensus%20using%20the%20%40nimiq%20web%20client%21%20Check%20it%20out%20here%3A%20https%3A%2F%2Fwww.nimiq.com%2Fdevelopers%2Fbuild%2Fweb-client%2Ftutorials%2Festablishing-consensus) and join the friendly Nimiq Community on [Telegram](https://t.me/joinchat/AAAAAEJW-ozFwo7Er9jpHw) and [Discord](https://discord.gg/cMHemg8), fellow devs are keen to help.
