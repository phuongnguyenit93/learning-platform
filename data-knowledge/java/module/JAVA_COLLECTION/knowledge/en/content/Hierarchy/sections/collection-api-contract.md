Most `Collection<E>` implementations share a small vocabulary. Learning it once prevents relearning the same operations separately for every `List`, `Set`, or `Queue`:

| Intent | Shared operation |
| --- | --- |
| number of elements | `size()` |
| check whether there are no elements | `isEmpty()` |
| membership test | `contains(value)` |
| obtain the traversal protocol | `iterator()` |
| add one element | `add(value)` |
| remove one matching element | `remove(value)` |
| remove elements matching a condition | `removeIf(predicate)` |
| remove all elements | `clear()` |
| contain every element from another collection | `containsAll(other)` |
| add elements from another collection | `addAll(other)` |
| remove elements also present in another collection | `removeAll(other)` |
| keep only elements also present in another collection | `retainAll(other)` |

```java
Collection<Order> selected = new ArrayList<>();
selected.add(orderA);
selected.add(orderB);

boolean hasOrderA = selected.contains(orderA);
boolean hasAll = selected.containsAll(List.of(orderA, orderB));

selected.remove(orderA);
selected.addAll(List.of(orderC, orderD));
```

Mutating methods in `Collection` are **optional operations**. A concrete collection may deliberately reject them by throwing `UnsupportedOperationException`. For example, a value returned by `List.of(...)` is still a `List`, but its mutating operations are unsupported. The interface tells callers which operations exist; the concrete object's contract tells callers which optional mutations are supported.

`toArray` is the standard boundary when an API requires an array:

```java
Order[] orderArray = selected.toArray(new Order[0]);
Object[] objectArray = selected.toArray();
```

`toArray()` without an argument returns `Object[]`; `toArray(new Order[0])` asks for an array whose runtime component type is `Order`. Converting to an array creates an array representation of the current elements; it does not turn the collection and array into one shared mutable container. A generator overload is introduced immediately after method-reference syntax is explained.
