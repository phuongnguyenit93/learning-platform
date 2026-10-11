`Comparator<T>` places the ordering rule **outside** the data type. This is useful when the same object needs multiple meaningful orderings: by total, by user, by time, by priority, and so on.

```java
Comparator<Order> byTotalDescendingThenId =
        Comparator.comparingInt(Order::totalCents)
                .reversed()
                .thenComparingLong(Order::id);

orders.sort(byTotalDescendingThenId);
```

Adding a tie-breaker such as `thenComparingLong(Order::id)` produces a clearer total order when the main criterion is equal. The same comparator shape can be supplied to `List.sort`, `TreeSet`, `TreeMap`, or `PriorityQueue`, but its meaning depends on the data structure:

- With `List.sort`, the comparator determines the resulting order after the sort operation.
- With `TreeSet`, a comparison result of `0` also means the two elements occupy the same logical position for set uniqueness.
- With `TreeMap`, the comparator determines both key order and key uniqueness under the comparison relation.
- With `PriorityQueue`, the comparator determines which element is at the head; iterating the queue does not therefore return every element in fully sorted order.

A comparator is therefore more than “a function used for sorting”. When placed into a sorted collection, it becomes part of that collection's organization and identity boundary.
