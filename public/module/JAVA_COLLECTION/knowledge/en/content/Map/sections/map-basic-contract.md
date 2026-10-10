Because `Map` does not extend `Collection`, it has its own core vocabulary. A beginner should understand these operations before moving to `compute` and `merge`:

| Intent | Operation |
| --- | --- |
| number of mappings | `size()` |
| check whether the map is empty | `isEmpty()` |
| read a value by key | `get(key)` |
| add/replace a mapping | `put(key, value)` |
| test key presence | `containsKey(key)` |
| test value presence | `containsValue(value)` |
| remove a mapping by key | `remove(key)` |
| remove every mapping | `clear()` |
| copy all mappings from another map | `putAll(otherMap)` |

```java
Map<Long, Order> orders = new HashMap<>();
orders.put(1001L, orderA);
orders.put(1002L, orderB);

boolean has1001 = orders.containsKey(1001L);
boolean containsOrderB = orders.containsValue(orderB);
Order found = orders.get(1002L);

orders.remove(1001L);
```

`containsKey` is usually more central than `containsValue`: lookup by key is the primary Map abstraction, while searching by value commonly requires examining many mappings and is not the main reason to choose a map.
