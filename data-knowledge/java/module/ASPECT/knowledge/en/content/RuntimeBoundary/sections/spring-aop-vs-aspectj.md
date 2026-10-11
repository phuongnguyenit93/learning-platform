Spring AOP focuses on method execution on Spring-managed objects through a proxy boundary.

Full AspectJ weaving has a broader model and can operate at join points that do not need to pass through a Spring proxy, depending on the weaving mode and configuration.

Another important detail concerns argument rewriting in around advice. Chapter 6 uses:

```text
ProceedingJoinPoint#proceed(Object[])
```

with Spring AOP semantics: the new array represents the arguments of the underlying method invocation. If the same source Aspect is compiled by the AspectJ compiler, the semantics of arguments supplied to `proceed(...)` are not identical; they correspond to parameters bound into the around advice signature. This is one reason why "the same @AspectJ syntax" should not be treated as evidence that two runtimes are completely equivalent.

This module intentionally does not switch to compile-time/load-time AspectJ because its main goal is understanding Spring AOP.

Therefore, debugging in this module should always begin with:

```text
1. is the object Spring-managed/proxied?
2. does the invocation pass through the proxy?
3. does the Advisor/pointcut match?
4. how does the interceptor/advice chain execute?
```
