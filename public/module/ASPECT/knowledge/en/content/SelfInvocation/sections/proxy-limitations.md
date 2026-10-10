Proxy-based interception also depends on whether a method can be intercepted by the current proxy strategy.

Cases such as private methods, final methods, or internal calls must be evaluated according to the concrete proxy mechanism. Do not assume that "adding an annotation is enough".

Spring features such as `@Transactional`, `@Async`, and `@Cacheable` often share the same mental model because they can rely on proxies/interceptors.

### Avoiding self-invocation

The preferred solution is often to refactor the boundary into another bean:

```text
Bean A
→ calls Bean B proxy
→ advice has a chance to run
```

Spring also offers techniques such as self-injection or `AopContext.currentProxy()`, but they make application code more explicitly dependent on AOP infrastructure; `AopContext.currentProxy()` also requires exposing the proxy. In this learning module, these are treated as escape hatches rather than the default design.
