First of all, the application must enable the async method execution infrastructure. In the module:

```java
@Configuration
@EnableAsync
class TaskExecutorConfig {
}
```

`@EnableAsync` requires Spring to register the infrastructure required for the detect/intercept method to have `@Async` According to the current async configuration.

Mental model:

```text
@EnableAsync
→ enable async method execution infrastructure

@Async
→ mark the method invocation that needs to be handled by the async interceptor

TaskExecutor
→ Practical execution strategy
```

`@Async` standalone is not a Java language feature and does not manually turn the method call to asynchronous if the application context does not enable or configure the corresponding async support.

When the method is called via the Spring proxy:

```text
caller
→ proxy intercept @Async method
→ submit invocation to TaskExecutor
→ caller receives Control/Result Handle
→ worker execution method
```

Therefore, `@Async` not Java keywords and do not create their own "miracles" inside the method.

### Self-invocation

If a method in the bean calls a `@Async` Other methods on the main `this`, the call may not pass through the proxy, so async interception does not occur under the default proxy mode.

Design is usually clearer when the async boundary is between two spring beans.
