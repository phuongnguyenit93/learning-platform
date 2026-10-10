Collection implementations are often compared by **operation complexity**. A beginner does not need the full theory of Big-O yet; the goal is to read the notation used throughout this module:

| Notation | Mental model | As `n` becomes large |
| --- | --- | --- |
| `O(1)` | roughly the same amount of work regardless of element count | grows very little |
| `O(log n)` | each step discards a large portion of the search space | grows slowly |
| `O(n)` | work may grow in proportion to the number of elements | grows roughly linearly |

For example, with 1,000,000 elements an `ArrayList.get(index)` can still calculate the target position directly (`O(1)`), while searching a list by value may inspect many elements (`O(n)`). A balanced-tree structure such as `TreeMap` typically follows a path whose height grows as `O(log n)`.

Two qualifiers also appear frequently:

- **amortized O(1)** means most operations are cheap but an occasional operation is more expensive, such as an `ArrayList` resize; averaged over a long sequence, the cost remains near constant;
- **expected O(1)** means the expected cost is near constant under assumptions such as a reasonable hash distribution; it is not an absolute worst-case guarantee.

Big-O describes a **growth trend**, not a promise that one operation is always faster in every real program. Memory layout, cache locality, data size, and the actual workload still matter.
