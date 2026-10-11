Don't learn the rules:

> `thenApplyAsync` definitely run on a different Thread stage first.

More Useful Rules:

- non-async dependent action can be executed by Thread completion stage or Thread joining completion;
- The Async variant is submitted for execution according to the default Async facility or `Executor` specified;
- The specific worker name is not a contract that it is required to be different from the previous worker stage.

If the execution policy is important, pass the executor explicitly:

```java
future.thenApplyAsync(this::transform, executor);
```

References:

```text
AsyncController#executionVariant()
GET /async/execution-variant
```

The experiment uses a completed stage to show `thenApply` can run inline on the caller, while `thenApplyAsync(..., executor)` is dispatched via the specified executor. The conclusion to be kept is **Execution Policy**, not assuming that every async variant always runs on a different Thread stage first.
