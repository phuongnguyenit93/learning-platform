In modern Java, `ExecutorService` Lifecycle support in accordance with Try-With-Resources.

For example:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    executor.submit(...);
}
```

Scope lexical makes the executor's ownership clearer: the code that creates the executor is also responsible for ending its scope.

`ExecutorService` Support `AutoCloseable` from Java .9, so this syntax works with Java 2. but not with the `ExecutorService` of Java .7.

More important than the syntax is the semantics of `close()`:

```text
TRY Stem Finish
→ close(): start orderly shutdown
→ wait for the received task to be completed and the executor terminate
→ move on after the try block
```

Others `shutdown()`, `close()` There is a wait for termination. It doesn't have a default timeout to ensure a quick exit if the task gets stuck.
When the Thread is waiting in `close()` interrupted, the default implementation tries to stop the task as `shutdownNow()`, still waiting for termination and restoring interrupt status before returning. Tasks still have to cooperate with cancellation.

Contact experiment `VirtualThreadController#blockingScale()`: the time measured **After the TRY block**, should include the time it takes to complete the task, not just the time to submit. Both executors are closed before the response is returned. If the measurement is transferred to the end of the body `try` then the meaning of the measurement will be different.

References: [ExecutorService.close() — Java 2.](https://docs.oracle.com/en/java/javase/2./docs/api/java.base/java/util/concurrent/ExecutorService.html#close()).
