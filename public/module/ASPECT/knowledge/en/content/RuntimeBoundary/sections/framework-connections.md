After understanding proxies + Advisors + interceptor chains, the same mental model can help explain many declarative features in the Spring ecosystem, for example:

```text
transaction management
caching
method security
async method execution
```

The exact implementation of each feature can differ, but questions about proxy boundaries, method interception, and self-invocation are often still useful.

Another boundary is important for async/reactive APIs:

```text
@Around measures method invocation time
≠
the time when a CompletableFuture / Mono / Flux finishes the asynchronous work
```

If a method returns an async/reactive container very quickly, the advice can complete before the real workload finishes. Measuring end-to-end completion requires instrumentation appropriate to that async/reactive abstraction, not only timing around `proceed()`.
