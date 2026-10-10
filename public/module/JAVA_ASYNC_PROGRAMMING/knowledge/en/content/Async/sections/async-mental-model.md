Asynchronous describes the relationship between callers and jobs:

```text
Caller Submit Work
→ don't necessarily wait for the work to be completed right at the submission point
```

But the worker executing that job can still block it.

For example:

```java
CompletableFuture.supplyAsync(() -> blockingJdbcCall());
```

Callers can be freed from JDBC calls, but workers running lambda can still be blocked by JDBC.

Therefore, it is necessary to distinguish:

| Concept | Question |
| --- | --- |
| Async | Does Caller have to wait for completion right away? |
| Parallel | Are there multiple jobs that actually run simultaneously? |
| Blocking | Is the executable thread held in the meantime? |
| Non-blocking | Does the operation avoid holding the Thread while waiting for an external event? |
