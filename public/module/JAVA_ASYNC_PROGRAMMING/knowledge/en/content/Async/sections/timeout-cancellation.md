A production pipeline needs to think about:

- timeout;
- cancellation;
- propagation of interruption/cancellation to underlying work;
- partial failure;
- cleanup.

APIs such as `orTimeout(...)` and `completeOnTimeout(...)` Helps perform the timeout at the stage level, but it should not be assumed that the future timeout will force all blocking operations below it to stop immediately.

Distinguish three things:

```text
get(timeout)
→ only limit the time the caller waits for the result

orTimeout / completeOnTimeout
→ changes to CompletableFuture's completion semantics

Future.cancel(true)
→ cancellation request can be accompanied by the interruption of the running task.

CompletableFuture.cancel(true)
→ cancel completion state
→ MayInterruptIfRunning parameter does not control CompletableFuture's underlying processing
```

None of the above three mechanics are a primitive "kill Thread no matter what the code is doing".

References:

```text
AsyncController#timeoutCancellation()
GET /async/timeout-cancellation
```

The experiment runs two separate cases, each with its own executor/latch and cleanup bounded:

```text
orTimeout
→ future complete with TimeoutException
→ underlying workers don't claim to interrupt themselves

CompletableFuture.cancel(true)
→ future moves to cancelled state
→ join() throws a CancellationException
→ worker is still not interrupted by cancel(true)
→ experiment must actively release underlying work
```

This is an important distinction with `Future` Red `ExecutorService.submit(...)` returned in the previous part: cannot be derived from words `cancel(true)` that every implementation of `Future` all have the same interruption behavior.
