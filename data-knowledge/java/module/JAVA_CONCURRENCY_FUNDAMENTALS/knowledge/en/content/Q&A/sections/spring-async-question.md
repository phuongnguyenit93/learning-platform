Such an inference should not be made.

`@Async` dispatch invocation via Spring async infrastructure and the executor is resolved for the method/application.

The application must have the async method execution infrastructure enabled, for example by `@EnableAsync` in the corresponding configuration. With `void @Async`, caller does not have a Future to receive failure; need `AsyncUncaughtExceptionHandler`/logging/metrics or your own channel if the failure is critical.

If used `ThreadPoolTaskExecutor`, workers are managed/reused by the pool.

If the execution strategy uses virtual-thread-per-task, the behavior is different.

Let's look at the actual executor instead of seeing annotation as the only execution mechanism.
