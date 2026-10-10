`Future` Mainly handle to:

- completion inspection;
- cancel;
- Blocking `get()` result.

`CompletableFuture` Add completion pipeline/composition:

- transform;
- compose;
- combined;
- race;
- error recovery.

Two details to remember:

```text
Future returned by ExecutorService.submit(...)
→ future.cancel(true)
→ can request interrupt running task

CompletableFuture.cancel(true)
→ mayInterruptIfRunning does not control the processing of CompletableFuture implementation
```

`allOf()` / `anyOf()` also only aggregate completion. Completion can be exceptional, and the aggregate operation does not default to a policy that automatically cancels the remaining sibling futures. Separate `allOf()` It should not be interpreted as a fail-fast barrier: an early fail does not mean that the aggregate is complete immediately when other children are not yet complete.

and `join()` non-blocking variant of `get()`: it can still wait for completion; the notable difference lies in the exception API (`CompletionException` Unchecked vs `ExecutionException` Checked's `get()`).
