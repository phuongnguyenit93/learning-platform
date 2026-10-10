Spring singleton only states that containers typically share a bean instance.

That doesn't automatically make a thread-safe or thread-unsafe bean.

A stateless service type:

```java
@Service
class PriceService {
    BigDecimal calculate(Order order) {
        Use only appropriate local variables and dependency thread-safe
    }
}
```

Avoid a large group of race conditions by not keeping the mutable request-specific state in the field.

But don't say "stateless bean is absolutely safe". The service can still manipulate shared database rows, mutable arguments, external resources, or non-thread-safe dependencies.

### Bean scope not Thread scope

Spring also has scopes such as singleton, request, and session, but descriptive scopes **Bean's Lifecycle/Lookup Boundary**, not a concurrency guarantee.

Mental model:

```text
singleton
→ a widely used bean instance in an application context

Request Scope
→ bean instance tied to the lifecycle of an HTTP request

Session Scope
→ bean instance tied to an HTTP session
```

It should not be transformed into:

```text
request scope = one object per Thread
session scope = one object per Thread
```

Request and Thread are two different lifecycles. Async processing can transfer execution to another Thread; the framework uses context/proxy to resolve the scoped object according to the request semantics rather than because the bean "belongs" to a worker thread.

In particular, session-scoped mutable state is not automatically thread-safe: the same user/session can have multiple concurrent requests. Bean scope does not replace synchronization or design avoids shared mutable state.
