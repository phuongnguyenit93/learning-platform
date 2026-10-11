The choice should follow ownership:

```java
List<Order> source = new ArrayList<>(List.of(
        new Order(1, 1, 20_000),
        new Order(2, 2, 10_000)
));

List<Order> readOnlyView = Collections.unmodifiableList(source);
List<Order> snapshot = List.copyOf(source);
List<Order> reverseView = source.reversed(); // Java 21: reverse-ordered view

source.add(new Order(3, 3, 15_000));

System.out.println(readOnlyView.size()); // 3
System.out.println(snapshot.size());     // 2
System.out.println(reverseView.getFirst().id()); // 3
```

Choose a **view** when multiple parties should observe the same live collection and owner changes are intended to appear immediately. Choose a **defensive copy** when an API boundary needs an independent structural snapshot that is not affected by later source mutations.

Neither a view nor a copy automatically provides thread safety or deep immutability. When a collection is shared across threads, synchronization/concurrent-collection choices belong to the corresponding concurrency material.
