### Pointcut too broad

```text
execution(* com.example..*(..))
```

can intercept more methods than intended and make behavior hard to predict.

### Business logic inside an Aspect

If pricing decisions, order state, or the main workflow live inside an Aspect, dependencies become hidden and the system becomes harder to test and debug.

### Silently changing arguments or return values

`@Around` can do this, but technical capability does not automatically make it a good design.

### Swallowing exceptions

An Aspect that catches an exception and returns a fake value can break the target contract and hide failures.

### Too many ordering dependencies

If correctness depends on a complex chain of `@Order` relationships, the abstraction has usually gone beyond what AOP should carry.

### Mutable state in an Aspect

A normal Aspect bean is typically a singleton in the ApplicationContext. A mutable field such as:

```java
private int currentRequestCount;
```

can therefore be accessed by multiple requests/threads and create race conditions or leak state across invocations.

Prefer stateless Aspects. If state is truly required, design the scope and concurrency semantics explicitly rather than assuming each invocation gets its own Aspect instance.

`AopTraceLog` in this learning module uses `ThreadLocal` only to separate events for each request/thread while observing experiments. It is instrumentation for learning, not a reason to place business state into an Aspect's `ThreadLocal`.
