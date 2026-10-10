Spring Boot supports virtual-thread-oriented task execution when the appropriate property is enabled, for example in the Boot version it supports:

```properties
spring.threads.virtual.enabled=true
```

But it should not be interpreted as:

> turn on this property, then every Thread in the application becomes a virtual thread.

Custom executors, own libraries, custom schedulers, or code that create their own Thread platform still have their own lifecycle/execution strategy.

When you need to be sure, look at the actual executor/thread instead of inferring from the property absolutely.

Since virtual threads are daemon threads, applications with only daemon threads can exit the JVM even though there is still background work expected. With Spring Boot, when the application needs to be kept independent of non-daemon workers, it can be used `spring.main.keep-alive=true` so that Boot keeps the JVM alive. This behavior is especially noticeable with the scheduler/background component when virtual threads are enabled.
