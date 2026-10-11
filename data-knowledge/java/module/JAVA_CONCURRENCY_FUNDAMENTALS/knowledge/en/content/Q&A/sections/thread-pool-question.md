Not under the contract of `execute()`.

Flow:

```text
CORE
→ queue
→ Max Workers
→ rejection
```

Backpressure must come from a specific policy/architecture, for example `CallerRunsPolicy`, bounded admission control or upstream rate limiting.

### Are execute() and submit() the same in terms of failure observation?

Nope.

```text
execute(Runnable)
Void →
→ uncaught failure follows the worker uncaught-exception path

submit(Runnable/Callable)
→ Future
→ result/failure is held in Future
→ get() expose failure via ExecutionException
```

Submit and leave `Future` This can cause the application to lose an important failure-observation channel.
