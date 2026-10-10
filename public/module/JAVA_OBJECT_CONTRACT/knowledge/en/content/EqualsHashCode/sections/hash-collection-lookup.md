At the mental-model level, lookup for a **non-null key** can be understood as:

```text
lookup key
    ↓
key.hashCode()
    ↓
collection uses the hash to narrow the candidate group
    ↓
inspect compatible candidates
    ↓
equals(...)
    ↓
match / no match
```

This is a **boundary model**, not a promise about every internal detail of a particular `HashMap` version. Implementations may optimize collision handling; your object only needs to honor the public contract collections rely on.

`HashMap` also supports a `null` key through implementation-specific special handling, so the diagram should not be read as “Java always invokes `hashCode()` on every possible key.”

### EVIDENCE WITH `HashSet`

```java
Set<UserId> ids = new HashSet<>();
ids.add(new UserId("U-100"));

System.out.println(ids.contains(new UserId("U-100")));
```

For this to print `true`, two distinct instances need both:

```text
the same logical equality
        +
a consistent hash contract
```

The caller does not need the original reference to look up an equivalent logical value.

### `HashMap` USES THE SAME CONTRACT

```java
Map<UserId, String> names = new HashMap<>();
names.put(new UserId("U-100"), "An");

String name = names.get(new UserId("U-100"));
```

Callers normally expect `name` to be `"An"`. That expectation only makes sense when the key type has coherent equality and hashing semantics.
