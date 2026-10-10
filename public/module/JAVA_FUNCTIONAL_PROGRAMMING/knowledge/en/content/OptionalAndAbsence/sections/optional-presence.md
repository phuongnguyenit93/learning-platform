`isPresent()` and `isEmpty()` let you inspect whether a value exists.

`isPresent()` has existed since Java 8; `isEmpty()` was added in Java 11. Code that must compile against Java 8 cannot use `isEmpty()`.

```java
if (user.isPresent()) {
    System.out.println(user.get().name());
}
```

That code is legal, but repeatedly checking then calling `get()` often recreates the same branching style that `Optional` was meant to make explicit. When the operation fits, methods such as `map`, `filter`, `ifPresent`, or fallback methods keep the "present vs absent" decision attached to the `Optional`.

Direct presence checks are still reasonable when the surrounding control flow is genuinely clearer that way. `Optional` is an API tool, not a rule that forbids ordinary `if` statements.
