Do not return mutable internal references when callers are not allowed to modify state.

Possible contracts include:

- immutable/unmodifiable views;
- `List.copyOf(...)`;
- fresh copies.

For the `BankAccountSnapshot` above, `List.copyOf(tags)` returns an unmodifiable result rather than the mutable internal list itself:

```java
snapshot.tags().add("VIP"); // UnsupportedOperationException
```

An unmodifiable view is not automatically deep immutability; the underlying data may still change elsewhere.
