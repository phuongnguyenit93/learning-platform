`CompletableFuture` Allows for continuation instead of forcing the caller to `get()` step by step.

Important method groups:

### Transformation

```text
thenApply
thenApplyAsync
```

### Flat composition

```text
thenCompose
thenComposeAsync
```

Used when a callback returns a `CompletionStage` and want to avoid nested futures.

### Combine two independent branches

```text
thenCombine
thenCombineAsync
```

### Side effect

```text
thenAccept
thenRun
```

References:

```text
AsyncController#pipeline()
GET /async/pipeline
```

Pipeline demo:

```text
order task ───────────┐
                     ├─ thenCombine → total
exchange-rate task ──┘
                           ↓
                       thenApply
```

The first two branches use a local custom executor; the executor is shut down by completion callback.

### get() and join() are different in the exception model

Both `get()` and `join()` can all wait for completion, but the surface API is different:

```text
get()
→ checked InterruptedException
→ checked ExecutionException when computation fail

join()
→ not declaring a checked exception
→ exceptional completion is exposed via CompletionException
→ cancelled future can throw a CancellationException
```

`join()` does not mean non-blocking. If the stage is not complete, the caller may still have to wait.

In experiment `allOf()`, call code `all.get(...)` with a timeout to bounded wait the entire barrier first, then use the `join()` on each completed future to get the typed result. This is an API selection, not two different execution mechanisms.
