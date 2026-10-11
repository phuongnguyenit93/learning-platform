Null handling belongs to the **implementation contract**; it cannot be inferred from `List`, `Set`, `Map`, or `Queue` alone. A compact reference:

| Implementation | Basic `null` policy |
| --- | --- |
| `ArrayList` | permits `null` elements |
| `LinkedList` | permits `null` elements, although nulls are ambiguous in queue-style APIs |
| `HashSet` / `LinkedHashSet` | permit one `null` element |
| `TreeSet` | ordinary natural ordering rejects `null`; a custom comparator can define handling |
| `HashMap` / `LinkedHashMap` | permit one `null` key and multiple `null` values |
| `TreeMap` | ordinary natural ordering rejects `null` keys; a custom comparator can define handling; null values are permitted |
| `ArrayDeque` | rejects `null` |
| `PriorityQueue` | rejects `null` |
| `List.of` / `Set.of` / `Map.of` and the corresponding `copyOf` families | reject `null` elements/keys/values |

Do not treat this table as a reason to design APIs around `null`. Queue operations such as `poll/peek` use `null` to represent “no element,” so storing null values would make the semantics ambiguous even in a different implementation that happened to permit them.
