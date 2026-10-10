Controller:

```text
PointcutController#comparePointcuts()
```

Endpoint:

```text
GET /aop/pointcut/compare
```

The controller calls these methods in sequence:

```text
PointcutService#byExecution()
PointcutService#byAnnotation()
PointcutService#byArgs("demo")
PointcutService#byRuntimeArgs("runtime-string")
PointcutService#byWithin()
PointcutService#byThisAndTarget()
PointcutService#byBean()
PointcutService#unmatched()
```

Aspect:

```text
PointcutMatchingAspect
```

The response `events` will show:

```text
pointcut:execution
target:byExecution

pointcut:@annotation
target:byAnnotation

pointcut:args:demo
target:byArgs:demo

pointcut:args-runtime-type=String
target:byRuntimeArgs:runtime-string:declaredType=Object

pointcut:within+named-composition
target:byWithin

(both pointcut:this-proxy-type and pointcut:target-type appear)
target:byThisAndTarget

pointcut:bean-name
target:byBean

target:unmatched
```

`unmatched()` intentionally matches no advice and acts as a comparison baseline.

`byRuntimeArgs(Object)` intentionally declares its parameter as `Object`, while the controller passes a `String`. Advice using:

```text
args(java.lang.String)
```

still matches because `args(...)` evaluates the **runtime argument type**. This is an important distinction from `execution(...)`: `execution(...)` mainly sees the declared method signature, while `args(...)` sees the argument shape/type at runtime.

`byWithin()` also demonstrates named pointcut composition:

```text
pointcutServiceType()
&&
byWithinMethod()
```

`this(...)` and `target(...)` can both match in the current experiment, but their semantics differ:

```text
this(...)
→ inspects the proxy object's type

target(...)
→ inspects the target object's type behind the proxy
```

Do not use the order between `pointcut:this-proxy-type` and `pointcut:target-type` as a learning contract. They come from two advice methods with the same precedence; the experiment only needs to prove that **both matching rules are true** for the current invocation.

The difference becomes clearer when studying JDK proxies and CGLIB in the Advanced section.

`bean(pointcutService)` is a Spring AOP-specific designator: it selects join points based on Spring bean identity/name rather than only Java type or method signature.
