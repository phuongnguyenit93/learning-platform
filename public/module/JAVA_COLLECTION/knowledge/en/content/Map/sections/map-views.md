`keySet()`, `values()`, and `entrySet()` do not normally create three independent collections. They are **views backed by the original map**: supported changes through one side can be observed from the other.

```java
Map<Long, String> names = new HashMap<>();
names.put(1L, "An");
names.put(2L, "Binh");

Set<Long> keys = names.keySet();
keys.remove(1L);

System.out.println(names.containsKey(1L)); // false

names.put(3L, "Chi");
System.out.println(keys.contains(3L));      // true
```

The views do not support every mutation operation. For example, `keySet().add(key)` does not have enough information to create a mapping because there is no value, so that operation is unsupported. Create an explicit copy when an independent snapshot is required:

```java
Set<Long> keySnapshot = Set.copyOf(names.keySet());
List<String> valueSnapshot = List.copyOf(names.values());
```

This is the same conceptual family as `List.subList`: a **view shares backing state**, while a copy has its own structural state.
