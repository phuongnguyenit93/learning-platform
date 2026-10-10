In this module's experiment:

```text
TerminologyAspect
→ Aspect

explainTerms(...)
→ Advice

execution(...TerminologyService.execute(..))
→ Pointcut expression

TerminologyService.execute()
→ selected Join Point (method execution)

TerminologyService instance
→ Target Object

object injected into the Controller
→ AOP Proxy
```

In **Spring AOP**, the join point model is **method execution**. A pointcut selects a subset of those method executions, while the proxy boundary determines whether the invocation actually enters the AOP chain.

`weaving` is the general AOP term for linking an Aspect to a target/advised object. Spring AOP does this at runtime with proxies; full AspectJ also supports compile-time or load-time weaving and a broader join point model.
