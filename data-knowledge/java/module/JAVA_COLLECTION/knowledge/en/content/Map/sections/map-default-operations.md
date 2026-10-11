Before `compute` or `merge` is needed, many map updates are clearer through simpler operations:

```java
Order fallback = new Order(-1, -1, 0);
Order found = orderById.getOrDefault(1001L, fallback);

orderById.putIfAbsent(1003L, new Order(1003, 9, 75));
orderById.replace(1003L, new Order(1003, 9, 80));

boolean replaced = orderById.replace(
        1003L,
        new Order(1003, 9, 80),
        new Order(1003, 9, 85)
);

boolean removed = orderById.remove(1003L, new Order(1003, 9, 85));
```

- `getOrDefault` supplies a fallback only when the key has **no mapping**; if the key exists and maps to `null`, the result is still `null`; the method does not insert the fallback;
- `putIfAbsent` writes only when the key has no non-null mapping;
- `replace` changes a value only when the key exists according to the selected overload;
- `remove(key, value)` removes only when both the key and current value match.

These default methods often express intent better than a `containsKey → get → put/remove` sequence. Do not infer cross-thread atomicity from the plain `Map` interface; concurrent implementations have their own contracts in the concurrency curriculum.
