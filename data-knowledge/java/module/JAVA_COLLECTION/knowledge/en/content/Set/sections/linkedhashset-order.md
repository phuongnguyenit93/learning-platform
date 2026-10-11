`LinkedHashSet` adds a defined encounter order to hash-set uniqueness. With ordinary `add` operations, that order is the order in which elements were first inserted.

```java
Set<Long> userIds = new LinkedHashSet<>();
userIds.add(7L);
userIds.add(2L);
userIds.add(9L);
userIds.add(2L);

System.out.println(userIds); // [7, 2, 9]
```

Adding `2L` again does not create a duplicate and does not automatically move it to the end under ordinary `add` semantics.

This implementation is useful when the domain needs both:

```text
uniqueness
    +
predictable encounter order
```

For example, we can collect unique users in the order they first appear in an order stream:

```java
Set<Long> usersInFirstSeenOrder = new LinkedHashSet<>();
for (Order order : orders) {
    usersInFirstSeenOrder.add(order.userId());
}
```

In Java 21, `LinkedHashSet` implements `SequencedSet`. In addition to its encounter order, it gains first/last operations, explicit positioning such as `addFirst`/`addLast`, and a `reversed()` view. That makes its ordering contract directly expressible rather than merely observable when printing values.

This ordering requires extra linkage metadata compared with `HashSet`. Pay that cost when stable order has value to the program.
