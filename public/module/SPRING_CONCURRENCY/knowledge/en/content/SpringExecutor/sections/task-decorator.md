This is a direct bridge to the ThreadLocal section.

Pattern:

```text
request/caller thread
    context=REQUEST-123
        ↓ submit
TaskDecorator capture REQUEST-123
        ↓
Worker Thread
        ↓ restore REQUEST-123
Async Method Runs
        ↓ finally
restore/remove worker context
```

Demo Hold `DemoContext` to clearly see the capture/restore/cleanup mechanism, and at the same time propagate two more practical contexts commonly encountered in Spring applications:

- SLF4J MDC, for example `requestId` used for log correlation;
- Spring `RequestAttributes`, is the context associated with the current HTTP request.

References:

```text
DemoTaskDecorator
DemoContext
```

`DemoTaskDecorator` Capture all three contexts in the caller thread, restore them on Worker, and then restore/clear the old state in the `finally`.

The most important rule of a decorator is not just `Set`, which is **cleanup/restore in finally** because the worker will be reused for another task. If only the MDC/RequestAttributes are set without cleanup, the next task running on the same worker can see the context of the previous request.

`TaskDecorator` It should also not be treated as a universal async exception handler. Decorator receives a `Runnable` execution callback; the callback can be a wrapper created by the framework/executor instead of the original business lambda. With execution by `Future`/`FutureTask`, failure can be captured into the completion handle instead of always exiting directly from the `Runnable.run()` for the decorator to catch. So:

```text
TaskDecorator
→ context capture / restore / cleanup

Future / async handler / rejection handling
→ failure observation under the corresponding contract
```

Don't mix these two responsibilities just because they're around the execution boundary.

### Lifecycle of RequestAttributes

Propagation does not extend the lifecycle of an HTTP request. An async task can outlive the original request; then it should not assume every object/request-scoped state taken from `RequestAttributes` are still valid for discretionary use.

If the async work only needs a few values such as `requestId`, tenant ID or principal id, design is usually more secure and clear when captured **Essential Values** to a separate immutable context instead of keeping long-term dependencies on the request object.
