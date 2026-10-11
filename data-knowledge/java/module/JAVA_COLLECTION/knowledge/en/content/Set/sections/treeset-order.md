`TreeSet` solves a different problem: it maintains elements in **sorted order**, rather than insertion order.

```java
Set<Long> orderIds = new TreeSet<>();
orderIds.add(30L);
orderIds.add(10L);
orderIds.add(20L);

System.out.println(orderIds); // [10, 20, 30]
```

Ordering comes from:

- an element's natural ordering when no comparator is supplied;
- or a `Comparator<? super E>` provided when the set is created.

```java
record User(long id, String name) {}

Set<User> usersByName = new TreeSet<>(
        Comparator.comparing(User::name)
                  .thenComparingLong(User::id)
);
```

For `TreeSet`, a comparison result of zero means two elements occupy the same logical set position:

```java
Comparator<User> byNameOnly = Comparator.comparing(User::name);
Set<User> users = new TreeSet<>(byNameOnly);

users.add(new User(1, "An"));
users.add(new User(2, "An"));

System.out.println(users.size()); // 1
```

The two users have different IDs, but the comparator looks only at `name`, so `compare(a, b) == 0` and `TreeSet` treats them as one logical position for storage. If ordering is inconsistent with `equals`, `TreeSet` still has defined behavior, but the sorted set no longer cleanly implements the general equality contract of `Set`. In practice, a comparator used for `TreeSet` should be consistent with the equality notion the API intends to expose, or a different structure should be chosen.

`TreeSet` typically provides O(log n) `add`, `contains`, and `remove` operations. In exchange, it provides sorted/navigable operations such as `first`, `last`, `lower`, `higher`, `floor`, and `ceiling`.

Since Java 21, the sorted-set hierarchy also has sequenced semantics, so first/last and reversed views fit a common API. The core reason to choose it remains **sorted order**, not insertion order.
