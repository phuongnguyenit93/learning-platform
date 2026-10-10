`ListIterator<E>` extends the iterator idea specifically for `List`. In addition to moving forward, it can move backward, expose neighboring indexes, and coordinate mutation with the traversal position.

```java
List<Order> orders = new ArrayList<>(List.of(orderA, orderB, orderC));
ListIterator<Order> it = orders.listIterator();

while (it.hasNext()) {
    int index = it.nextIndex();
    Order order = it.next();
    System.out.println(index + " -> " + order.id());
}

while (it.hasPrevious()) {
    Order order = it.previous();
    System.out.println(order.id());
}
```

Characteristic operations include:

| Operation | Meaning |
| --- | --- |
| `hasPrevious()` / `previous()` | move backward |
| `nextIndex()` / `previousIndex()` | inspect cursor position |
| `set(e)` | replace the element returned by the latest `next/previous` |
| `add(e)` | insert at the cursor position |
| `remove()` | remove the element most recently returned by traversal |

For example, normalize an order while traversing:

```java
ListIterator<Order> it = orders.listIterator();
while (it.hasNext()) {
    Order current = it.next();
    if (current.totalCents() < 0) {
        it.set(new Order(current.id(), current.userId(), 0));
    }
}
```

Use `ListIterator` when the algorithm genuinely needs **position + bidirectional traversal + traversal-aware mutation**. Enhanced `for` is simpler for read-only element processing, while `removeIf` is often clearer for predicate-based removal. `add/set/remove` remain optional operations when the underlying list does not support mutation.
