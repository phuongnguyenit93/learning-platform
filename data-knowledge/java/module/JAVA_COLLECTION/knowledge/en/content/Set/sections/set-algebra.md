Because a `Set` models unique members, the bulk operations inherited from `Collection` map naturally to set-style reasoning:

```java
Set<Long> first = new HashSet<>(Set.of(1L, 2L, 3L));
Set<Long> second = Set.of(3L, 4L);
```

### Union

```java
Set<Long> union = new HashSet<>(first);
union.addAll(second); // [1, 2, 3, 4]
```

### Intersection

```java
Set<Long> intersection = new HashSet<>(first);
intersection.retainAll(second); // [3]
```

### Difference

```java
Set<Long> difference = new HashSet<>(first);
difference.removeAll(second); // [1, 2]
```

These operations **mutate the receiving set** when it is mutable. Create a copy first when the original input must remain unchanged, as the examples do.
