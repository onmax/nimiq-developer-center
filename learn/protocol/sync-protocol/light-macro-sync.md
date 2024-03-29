# Light Macro Sync

The light macro sync method, designed for efficient synchronization with the macro chain, is employed by both light and full nodes. This method facilitates easy synchronization with the macro chain while conserving storage space. Using the zero-knowledge proof generated by prover nodes, these nodes can skip a substantial part of the chain without compromising the validity of the data.

A zero-knowledge proof is a small and easy-to-verify proof that enables the peer to verify the correctness of all election macro blocks since the genesis block.

The light macro sync consists of three processes:

1. Request the latest zero-knowledge proof (zkp) from a prover node, which includes a proof of the validity of the chain since the genesis block up to the latest election block;
2. Request epoch IDs, including both the latest election block (if no proof was generated in the step before) and checkpoint blocks;
3. Continuously check for any new checkpoint or election blocks, re-request blocks using the previous steps, and update the chain accordingly;

Note that if, during step 1, a proof hasn’t yet been generated from the most recent election block, the node receives a proof on the prior election block and requests the epoch ID for the most recent one. This might happen as zero-knowledge proof takes a considerable amount of time to be generated by the prover node.
