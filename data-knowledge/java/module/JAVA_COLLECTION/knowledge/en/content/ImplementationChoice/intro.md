# Choosing Collection Implementations

The final roadmap milestone, **Choosing Implementations and Specialized Collections**, starts by combining the contracts learned so far into a practical decision process. Collection choice should begin with the **semantics the problem needs**: whether indexing matters, whether duplicates are valid, whether lookup is by key, what order must be preserved, and which element should be removed next. Once the contract is correct, complexity, memory, mutation rules, null policy, and workload characteristics can refine the choice.

Choosing only because “`HashMap` is fast” or “`LinkedList` insertion is O(1)” is often misleading because complexity depends on the surrounding operation. Inserting into the middle of a `LinkedList` still requires finding the node first when the caller only has an index.
