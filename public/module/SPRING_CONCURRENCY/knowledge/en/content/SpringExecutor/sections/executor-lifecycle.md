A big advantage of Spring-managed executors is that containers can manage lifecycles.

`ThreadPoolTaskExecutor` There are shutdown-related options such as:

- wait for the task to be completed;
- timeout waiting for termination.

But "Spring management" doesn't mean that every task is definitely completed. Shutdown policy and timeout still have to match the SLA/deployment termination window.

Refer to the configuration of the module:

```text
TaskExecutorConfig#threadLearningTaskExecutor()
```

This method now configures both:

```text
setWaitForTasksToCompleteOnShutdown(true)
setAwaitTerminationSeconds(2)
```

Two small demo values to demo the lifecycle; production must match the termination window of the process/container and the actual task time.
