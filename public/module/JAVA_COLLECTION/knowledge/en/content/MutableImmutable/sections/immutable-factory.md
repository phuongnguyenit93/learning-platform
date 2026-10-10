`List.of`, `Set.of`, and `Map.of`/`Map.ofEntries` create **unmodifiable** collections whose contents are established at creation time. There is no separate mutable source collection that can later change the backing structure as there is with `Collections.unmodifiableList(source)`.

```java
List<String> users = List.of("U01", "U02", "U03");
Set<String> roles = Set.of("USER", "ADMIN");
Map<String, Integer> limits = Map.of(
        "STANDARD", 10,
        "PREMIUM", 100
);
```

Important contracts:

- These factories reject `null` elements/keys/values.
- `List.of` allows duplicate elements.
- `Set.of` rejects duplicate arguments.
- `Map.of`/`Map.ofEntries` reject duplicate keys.
- Application logic should not depend on a particular encounter order for `Set.of` or `Map.of`.

People often call these “immutable factories”, but the Java API specifies the results as **unmodifiable**. Mutable elements can still change:

```java
List<StringBuilder> values = List.of(new StringBuilder("A"));
values.getFirst().append("B");

System.out.println(values); // [AB]
```

The collection cannot add, remove, or replace an element, while the `StringBuilder` object itself remains mutable.
