Refer to the controller:

```text
TaskExecutorController#asyncWithContext()
GET /spring-executor/async-context
```

Controller Set:

```text
DemoContext=REQUEST-123
MDC[requestId] = REQUEST-123
RequestAttributes = current request managed by Spring Web
```

then call another bean that has:

```java
@Async("threadLearningTaskExecutor")
```

Response `CompletableFuture` said:

- caller thread;
- worker thread;
- DemoContext worker observed;
- MDC request id worker observed;
- whether the worker received Spring RequestAttributes.

Expectations:

```text
callerThread != workerThread
workerContext = REQUEST-123
workerMdcRequestId=REQUEST-123
workerHasRequestAttributes = true
```

The controller also captures context/MDC before setting the demo values and restores them in the `finally`. So the experiment doesn't lose the context that already exists on the caller thread.
