A getter returning an internal mutable collection leaks the reference. For the running `BankAccount` example:

```java
List<String> tags() {
    return tags;
}
```

Callers can now mutate `tags` without going through `BankAccount`'s rules.

The same problem occurs when a constructor stores a caller-owned mutable input directly.

The next chapter addresses this with immutability and defensive copying.
