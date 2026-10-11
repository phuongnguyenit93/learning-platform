A `ExecutorService` create Thread workers and often need an explicit shutdown if it is not managed by the framework/container.

Danger Pattern:

```java
void handleRequest() {
    ExecutorService pool = Executors.newFixedThreadPool(10);
    pool.submit(...);
    Forget Shutdown
}
```

Each request can create a new pool/worker.

References:

```text
LeakController#poolLeakPattern()
GET /leak/pool-pattern
```

The demo noted that the executor had not shut down in the middle of the experiment, then cleaned up with `shutdown/awaitTermination`.
