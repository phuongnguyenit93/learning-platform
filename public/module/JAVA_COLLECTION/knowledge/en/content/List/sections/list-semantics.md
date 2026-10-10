`List<E>` is a collection with a defined encounter order and positional access through zero-based indexes.

```java
List<Order> orders = new ArrayList<>();
orders.add(new Order(1001, 7, 120));
orders.add(new Order(1002, 8, 90));
orders.add(new Order(1003, 7, 120));

Order first = orders.get(0);
Order second = orders.get(1);
```

Order is part of the `List` contract. Appending places an element at the end; inserting at index 1 shifts later positions.

Lists also permit equal elements:

```java
List<String> statuses = new ArrayList<>();
statuses.add("NEW");
statuses.add("NEW");

System.out.println(statuses.size()); // 2
```

That differs from `Set`, whose primary contract is uniqueness. If every occurrence is meaningful to the domain, `List` is often the appropriate starting point.

Typical operations are:

```java
orders.add(order);          // append
orders.add(1, order);       // insert by position
orders.get(1);              // read by position
orders.set(1, replacement); // replace at a position
orders.remove(1);           // remove by position
```

Since Java 21, `List` is a `SequencedCollection`. Lists therefore share first/last operations such as `getFirst()`, `getLast()`, `addFirst()`, `addLast()`, and `reversed()`. Whether mutation is supported still depends on the concrete list; an unmodifiable list may throw `UnsupportedOperationException` for modifying operations.
