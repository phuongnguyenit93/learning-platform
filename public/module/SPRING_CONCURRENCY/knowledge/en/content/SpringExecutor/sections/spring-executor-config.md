Config uses its own bean:

```text
threadLearningTaskExecutor
```

so that the experiments use an executor with a clear and easy-to-observe configuration.

The demo values are small because the goal is to learn semantics, not production sizing.

Sizing production still has to rely on workload/downstream/SLO like the Thread Pool.

Refer to the code:

```text
TaskExecutorConfig#threadLearningTaskExecutor()
```

### Demo config and production config are two different goals

Demo deliberately hard-coded small value:

```java
executor.setCorePoolSize(2);
executor.setMaxPoolSize(4);
executor.setQueueCapacity(8);
```

so that the experiment is easy to observe and does not depend on the environment.

Production should usually externalize the operational values that need to be tuned, for example:

```yaml
Application:
  async:
    core-pool-size: 8
    max-pool-size: 32
    queue-capacity: 500
    keep-alive-seconds: 60
    await-termination-seconds: 30
```

then bind with a configuration object:

```java
@ConfigurationProperties(prefix = "application.async")
public class AsyncExecutorProperties {
    private int corePoolSize;
    private int maxPoolSize;
    private int queueCapacity;
    private int keepAliveSeconds;
    private int awaitTerminationSeconds;
}
```

The config executor then takes the value from the properties instead of the hard-code.

Benefits:

- dev/staging/production can use different sizing without modifying the code;
- The deployment platform can be overridden by environment/config;
- operational tuning changes that are not mixed with business logic;
- It is easy to review clearly what are the semantics of the executor and what are the numbers that are suitable for the current workload.

But externalizing doesn't mean that every property should be allowed to be customized. Rejection policy, context propagation, or safety limits still need explicit default/validation to avoid a wrong config that alters the system semantics.

Mental model:

```text
Learning Demo
→ small, deterministic hard-code

production
→ typed configuration + validation
→ environment-specific values
→ metrics/load test for tuning
```

No copying of demo numbers `2/4/8` to production and also does not use the CPU-bound/I/O-bound formula as an absolute value.
