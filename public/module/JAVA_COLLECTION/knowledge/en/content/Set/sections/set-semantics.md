The general `Set<E>` contract is that it does **not contain two elements that are equal under the set equality contract**. In ordinary hash-based implementations such as `HashSet`, `equals` determines equality while `hashCode` helps locate candidate elements efficiently. The sorted-set behavior of `TreeSet` is deferred to its own section after the learner has the basic Set model.

For example, if we only need to know which users have orders:

```java
Set<Long> userIds = new HashSet<>();
userIds.add(7L);
userIds.add(8L);
userIds.add(7L);

System.out.println(userIds.size()); // 2
```

The second `add(7L)` does not create another element. `Set.add` returns `false` when the set does not change because an equivalent element is already present:

```java
boolean first = userIds.add(9L);  // true
boolean again = userIds.add(9L);  // false
```

A `Set` does not promise index-based access. If code needs “the third element,” a `List` or an explicitly ordered abstraction is usually a better fit.

Null policies vary by implementation. `HashSet` and `LinkedHashSet` allow one null element; a `TreeSet` using ordinary natural ordering does not accept null. Code should rely on the selected implementation's contract rather than assuming every `Set` behaves the same.

Since Java 21, `SequencedSet` combines `Set` uniqueness with a defined first/last encounter order. `LinkedHashSet` and the modern sorted-set hierarchy participate in that abstraction, allowing APIs to state that both uniqueness and order are part of the contract.
