When a task is submitted to the executor, context propagation typically requires three steps:

```text
caller Thread
   ↓ capture context
Runnable/Callable wrap
   ↓
worker Thread
   ↓ Restore context
run task
   ↓ finally
cleanup / restore previous context
```

References:

```text
ThreadLocalController#explicitPropagation()
GET /context/explicit-propagation
```

Demo create the worker before the parent sets the context, then wrap the task so that the worker still receives the correct context at the time of submission.

In Spring, `TaskDecorator` is a suitable place to package this pattern for `ThreadPoolTaskExecutor`; the `framework/spring-framework/concurrency` module owns the practical Spring integration.

In addition to wrapping the task yourself or using `TaskDecorator`, the Java ecosystem also has dedicated propagation solutions. Example `TransmittableThreadLocal` of Alibaba extends the idea of capturing/replaying context to executor reuse. However, this is **library-specific solution**, without changing the core mental model:

```text
Capture context at submission boundary
→ restore before the task runs
→ cleanup/restore previous state after task
```

So this chapter prioritizes explicit propagation and Spring `TaskDecorator`; Third-party libraries should only be selected when their semantics and integrations match the real application.
