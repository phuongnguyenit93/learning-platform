These implementations all enforce uniqueness but differ in ordering and cost:

| Implementation | Order | Lookup/add/remove | Good fit |
| --- | --- | --- | --- |
| `HashSet` | No encounter-order guarantee | expected O(1) | Membership/uniqueness only |
| `LinkedHashSet` | Insertion-based encounter order | expected O(1) | Uniqueness plus stable traversal order |
| `TreeSet` | Sorted by natural order/comparator | O(log n) | Always-sorted data and range/navigation operations |

In Java 21, `LinkedHashSet` participates in `SequencedSet`, so its order is also directly exposed through first/last operations and `reversed()`.

`TreeSet` requires a valid ordering and uses comparison results to determine uniqueness. If a comparator returns `0` for objects the business still needs to keep separately, either the comparator or the chosen structure does not match the requirement.
