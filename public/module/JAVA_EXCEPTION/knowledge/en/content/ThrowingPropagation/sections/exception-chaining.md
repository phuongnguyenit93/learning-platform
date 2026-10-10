Propagation can keep the original exception unchanged. When a new exception is created from an older one, Java can connect them through the `cause` so the original failure is not lost.

Example:

```java
Order load(long orderId) {
    try {
        return jdbcLoad(orderId);
    } catch (SQLException ex) {
        throw new RuntimeException(
                "Cannot load order " + orderId,
                ex
        );
    }
}
```

Flow:

```text
SQLException
→ original exception

RuntimeException
→ new exception

cause
→ still preserves SQLException for diagnosis
```

`RuntimeException` is only a wrapper for observing the mechanism in this example. The important point is **causal chaining**: preserve the older exception as the `cause` of the new one. Which wrapper type to use, and whether translation belongs at an abstraction boundary, are covered later in the custom-exception and boundary-design chapters.
