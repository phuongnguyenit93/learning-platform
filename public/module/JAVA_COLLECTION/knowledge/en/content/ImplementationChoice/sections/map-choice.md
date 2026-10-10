Map choice follows key lookup semantics and ordering:

| Implementation | Key order | Lookup/put/remove | Distinguishing trait |
| --- | --- | --- | --- |
| `HashMap` | No encounter-order guarantee | expected O(1) | General-purpose key lookup |
| `LinkedHashMap` | Insertion order or access order | expected O(1) | Ordered traversal; can support access-order caches |
| `TreeMap` | Sorted by key | O(log n) | Range queries and first/last/nearest-key navigation |

In Java 21, `LinkedHashMap` is a `SequencedMap`, making first/last/reversed encounter order explicit. Its `accessOrder=true` mode can reorder entries on access, which is useful for LRU-style structures when paired with an appropriate eviction policy.

If keys are enum constants, do not automatically choose `HashMap`. The next chapter's `EnumMap` expresses that domain more directly and uses a specialized representation.
