**Encounter order** is the order in which a sequential traversal sees elements. It describes how elements are encountered; it does not automatically mean “insertion order” or “sorted order”.

Examples:

- `ArrayList` encounters elements in index order.
- `LinkedHashSet` maintains an encounter order based on insertion order.
- `TreeSet` encounters elements in the set's sorted order.
- `HashSet` does not promise a specific encounter order, so application logic should not depend on whatever order happens to be observed.

Java 21 makes encounter order more explicit through `SequencedCollection`, `SequencedSet`, and `SequencedMap`. For example, `List` is a `SequencedCollection` and `SortedSet` is a `SequencedSet`. These abstractions define first/last access and a reverse-ordered view through `reversed()`. Mutating end operations such as `addFirst`, `addLast`, `removeFirst`, or `removeLast` are optional and can still be unsupported by a concrete implementation.

```java
List<Order> original = new ArrayList<>(orders);
List<Order> reversed = original.reversed();

System.out.println(reversed.getFirst()); // the last element of original
```

`reversed()` returns a reverse-ordered view, not an independent copy. Structural changes made through one side can be observed from the other when the underlying collection supports mutation. If an API boundary needs an independent snapshot, use a copy rather than only a view.

The key idea is that **encounter order is a property of the collection or view during traversal**. A `List` has a defined encounter order without necessarily being sorted, while a `HashSet` may print in the same order several times without that order becoming part of its contract.
