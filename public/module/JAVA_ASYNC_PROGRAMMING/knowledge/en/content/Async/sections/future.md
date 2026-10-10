`Callable<T>` The task description has a result/exception.

```java
Future<String> future = executor.submit(callable);
```

`Future` Allows:

- Inspection `isDone()`;
- `cancel(...)`;
- Get the result by `get()`;
- `get(timeout, unit)`.

Cut-off Points: `future.get()` is the caller's blocking wait.

References:

```text
AsyncController#future()
GET /async/future
```

Demo keep unfinished tasks, confirm `isDone=false`, then let the task finish running and call `get()`.

**Final Thoughts** `Future` detach submit from result retrieval, but call `get()` can still be blocked.

### <a id="future-cancellation">Future cancellation and mayInterruptIfRunning</a>

`Future.cancel(...)` change the completion state of Future to cancelled if the cancellation is accepted. Parameters:

```java
future.cancel(false);
future.cancel(true);
```

should not be construed as:

```text
false = task definitely stop gently
true = JVM kill task immediately
```

The mental model is more correct:

```text
cancel(false)
→ doesn't require a running interrupt task
→ task that has been run can continue to completion naturally

cancel(true)
→ implementation can interrupt a Thread that is running a task
→ task still has to cooperate with interruption
```

After Future has cancelled, `get()` do not return the result of the task but throw it `CancellationException`, including the case of underlying code with `cancel(false)` still continue to run to the end.

References:

```text
AsyncController#futureCancellation()
GET /async/future-cancellation
```

Experiment runs two tasks that are blocked at `CountDownLatch`:

```text
cancel(false)
→ Future cancelled
→ worker is not interrupted
→ task remains blocked until the experiment is actively released

cancel(true)
→ Future cancelled
→ worker is waiting to receive an InterruptedException
→ Task Ends via Cancellation Path
```

This is directly connected to the Interruption chapter:

```text
Future cancellation
→ can request interruption
→ interruption is still a cooperative protocol
```
