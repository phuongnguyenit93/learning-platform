`?` and `<T>` both avoid hard-coding one concrete type, but they solve **different API problems**.

When an API only needs to say “this value belongs to some compatible generic type” and never needs to refer to that exact type again, a wildcard is often enough:

```java
static int sizeOf(List<?> values) {
    return values.size();
}
```

When several positions must refer to **the same type**, a named type parameter preserves that relationship:

```java
static <T> T first(List<T> values) {
    return values.get(0);
}

static <T> void copyOne(T value, List<? super T> target) {
    target.add(value);
}
```

Mental model:

```text
?
→ an unknown type argument at a use site
→ no name is needed for reuse elsewhere

<T>
→ a named type variable
→ use it when an API must preserve the same type identity across positions
```

This is not a rule that “wildcards are for reads and `<T>` is for writes.” The real question is: **does the API need to preserve and reuse one type relationship across multiple positions?**
