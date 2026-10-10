Không.

```java
CompletableFuture.supplyAsync(() -> jdbcCall());
```

có thể giải phóng caller nhưng worker vẫn block trong JDBC.

Async nói về completion/caller relationship; non-blocking nói về cách operation chờ external event/resource.
