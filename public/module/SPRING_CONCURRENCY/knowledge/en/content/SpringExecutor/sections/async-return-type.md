Common types:

- `Void` for fire-and-forget;
- `Future<T>`;
- `CompletableFuture<T>`.

With `Void`, caller does not have a direct completion handle; exception handling also needs to be tailor-made.

In proxy-based `@Async`, exception of `Void` The method cannot be received by the caller `Future`. If the application is truly fire-and-forget, it is required `AsyncUncaughtExceptionHandler`/logging/metric strategy instead of assuming an exception will return itself to the HTTP caller.

With `CompletableFuture`, callers can compose results according to the concepts learned in the Async section.

The code currently uses the result-bearing method:

```text
TaskExecutorService#runAsync(...)
```

so that the caller has a clear completion handle and the experiment can observe deterministic.

### Demo exception of @Async void

With `Void`, Spring proxy cannot return exceptions to callers through `Future` because the caller does not receive any completion handles.

Configuration One `AsyncUncaughtExceptionHandler` Specifically:

```text
AsyncExceptionProbe
```

And an async method deliberately fails:

```java
@Async("threadLearningTaskExecutor")
public void failWithoutFuture(String correlationId) {
    throw new IllegalStateException(...);
}
```

References:

```text
TaskExecutorController#asyncVoidException()
GET /spring-executor/void-exception
```

The controller uses a correlation id just so that the learning experiment can observe the deterministic that the handler has received the correct failure. The expected response looks like this:

```text
handlerInvoked = true
method = failWithoutFuture
exceptionType = IllegalStateException
correlationId = ...
```

Probe also cleanup registration when observation future completes exceptional or timeout. Controller mounted timeout **Before** call the async proxy and also catch a synchronous submission failure. This is important because the task can be rejected at the submission boundary, before the `@Async` method actually runs and before `AsyncUncaughtExceptionHandler` Have a chance to receive an exception from Method Body.

The flow of the experiment is:

```text
Register Observation Future
→ attach timeout
→ call proxy @Async
   ├─ Successfully submit → worker running → handler complete future
   └─ submit rejected → caller receiving submission failure sync
                       → complete future exceptionally
→ all terminal paths are cleanup pending registration
```

Therefore, it is necessary to distinguish between **Task failure after dispatch** with **Failure at Submission/Admission**. `AsyncUncaughtExceptionHandler` Resolve Exit Exception `void @Async` Method body; it is not a replacement for rejection handling at the submission boundary.

**Final Thoughts** `Void @Async` is fire-and-forget for callers; error reporting must go through logging/metrics/`AsyncUncaughtExceptionHandler` or a separate channel. If the business flow needs to know the success/failure, prioritize the return `CompletableFuture`/result handle instead of `Void`.
