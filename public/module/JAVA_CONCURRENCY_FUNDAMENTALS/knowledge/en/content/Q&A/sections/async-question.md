Nope.

```java
CompletableFuture.supplyAsync(() -> jdbcCall());
```

can free the caller but the worker is still blocked in JDBC.

Async talks about completion/caller relationship; non-blocking talks about how operations wait for external events/resources.
