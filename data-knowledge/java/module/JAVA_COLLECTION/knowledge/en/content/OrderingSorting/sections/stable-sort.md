A sort is **stable** when elements that compare as equal retain their original relative order. `List.sort` and `Collections.sort` are specified to be stable.

```java
List<Order> orders = new ArrayList<>(List.of(
        new Order(3, 2, 10_000),
        new Order(1, 1, 20_000),
        new Order(2, 3, 10_000)
));

orders.sort(Comparator.comparingInt(Order::totalCents));

// Orders 3 and 2 both have totalCents = 10_000.
// Order 3 remains before order 2 because the sort is stable.
```

Stable sorting is useful when the input already has a meaningful secondary order. For example, data can first be ordered by time and then stable-sorted by status so that time order remains intact inside each status group.

Do not confuse a stable sort with a sorted collection. `TreeSet` does not keep two comparison-equal elements and remember their previous relative order; if the comparator returns `0`, the set treats them as equivalent for ordering and retains only one representative. If the business needs both, use an appropriate tie-breaker or choose a different structure.
