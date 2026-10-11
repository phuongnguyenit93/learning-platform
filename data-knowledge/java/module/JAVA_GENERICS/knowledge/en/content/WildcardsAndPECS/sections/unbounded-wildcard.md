```java
static int sizeOf(List<?> values) {
    return values.size();
}
```

`List<?>` means “a `List` of some specific type, but this method does not know which type.”

It is different from raw `List`:

- `List<?>` preserves generic type safety;
- raw `List` weakens or bypasses some generic checks and may produce unchecked warnings.

Elements can safely be read as `Object`:

```java
Object value = values.get(0);
```

A concrete value cannot be added because the compiler does not know the actual element type:

```java
// values.add("x"); // compile error
```

`null` is a type-system exception, but inserting `null` is rarely a useful reason to design a wildcard API.
