The chapters in this module use several binding styles. They can be summarized with this mental model:

```text
JoinPoint
→ signature / this / target / arguments

args(value)
→ binds a runtime argument to the value parameter

@annotation(annotation)
→ binds the annotation instance to an advice parameter

returning = "result"
→ binds the return value of a successful invocation

throwing = "throwable"
→ binds the exception leaving the invocation
```

Examples from this module:

```text
PointcutMatchingAspect#matchArgs(String value)
TrackingAspect#track(..., TrackExecution trackExecution)
AdviceLifecycleAspect#afterReturning(..., Object result)
AdviceLifecycleAspect#afterThrowing(..., Throwable throwable)
```

The important point is that advice can receive exactly the data bound by its pointcut/advice declaration instead of every advice manually parsing a generic `Object[]`.
