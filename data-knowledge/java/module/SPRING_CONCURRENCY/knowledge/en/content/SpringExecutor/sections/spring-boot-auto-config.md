It should not be said in general that:

> Without configuring the executor, `@Async` always use `SimpleAsyncTaskExecutor`.

That may be how fallbacks are described in the Spring Framework in some cases, but the application is using **Spring Boot 3.3.x**, where Boot has the task execution auto-configuration.

In the default configuration that does not use virtual threads, Boot usually provides `ThreadPoolTaskExecutor` for task execution if the application has not defined itself as a suitable executor.

When virtual threads are enabled using the corresponding boot configuration, the auto-configured task executor can switch to implementation using virtual threads.

Because of custom bean or `AsyncConfigurer` The last option can be changed, when behavior is critical, check the actual executor of the application instead of relying on a generic fallback sentence.
