`org.springframework.core.task.TaskExecutor` is Spring's abstraction for task execution.

It's close to `Executor` of Java but integrated into the Spring container.

`ThreadPoolTaskExecutor` is a common implementation, below use `ThreadPoolExecutor` and expose configurations such as:

- core pool size;
- max pool size;
- queue capacity;
- keep-alive;
- thread name prefix;
- rejection handler;
- TaskDecorator;
- shutdown behavior.

The mental model is still the part Thread Pool has learned:

```text
core → queue → max → rejection
```

Spring doesn't change this ground rule.

A Spring-specific detail is the exception type at the abstraction boundary. `ThreadPoolTaskExecutor` Spring Implementation `TaskExecutor` contract; when a task is rejected, the caller should handle it according to the Spring rejection semantics as `TaskRejectedException` instead of writing code that depends on that RAW `RejectedExecutionException` of JDK always passes constantly.

If you need a custom overload policy at the JDK layer, underlying `ThreadPoolExecutor` still use `RejectedExecutionHandler`; but the public contract that the application calls through `TaskExecutor` is a contract of Spring.
