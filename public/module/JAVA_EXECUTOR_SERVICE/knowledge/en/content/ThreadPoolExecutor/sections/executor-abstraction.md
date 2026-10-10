`Executor` Separation of work **submit task** from the way the task is executed.

```java
executor.execute(task);
```

Caller does not need to be self-sufficient `new Thread(...)` for each task.

`ExecutorService` Additional lifecycle and result-oriented APIs such as:

- `submit()`;
- `shutdown()`;
- `shutdownNow()`;
- `awaitTermination()`.

Important Points:

```text
Runnable/Callable = work
Executor = job execution strategy
ThreadPoolExecutor = an implementation that manages the worker pool
```

### <a id="execute-vs-submit">What's the difference between execute() and submit()?</a>

Both APIs can include `Runnable` to the executor, but the completion/result channel is different:

| API | Return | Result/exception observation |
| --- | --- | --- |
| `execute(Runnable)` | `Void` | None `Future`; Exit Task Exit Exception Follow Worker's Uncaught-Exception Path |
| `submit(Runnable/Callable)` | `Future<?>` / `Future<T>` | result/exception is kept in `Future`; Caller observes when `get()` |

Here's the actual footgun:

```java
executor.submit(() -> {
    throw new IllegalStateException("boom");
});
```

if the code is always removed `Future`, the exception may not appear in the way the developer expects from `execute()`.

References:

```text
ThreadPoolController#executeVsSubmit()
GET /thread-pool/execute-vs-submit
```

Experiment Use `UncaughtExceptionHandler` Separate for observation `execute()` and use `Future.get()` to observe `submit()`:

```text
execute(task throws)
→ uncaught exception path

submit(task throws)
→ Future complete exceptionally
→ get() throws an ExecutionException with root cause
```

**Final Thoughts** If you choose `submit()` For important tasks, there must be a strategy to observe completion/failure instead of submitting and forgetting the handle.
