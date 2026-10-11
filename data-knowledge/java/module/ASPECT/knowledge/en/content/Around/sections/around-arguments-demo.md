Controller:

```text
AroundAdviceController#arguments()
```

Endpoint:

```text
GET /aop/around/arguments
```

The controller passes:

```text
"  Book  "
```

The Aspect reads the argument from `joinPoint.getArgs()`, normalizes it to:

```text
book
```

and continues with:

```java
joinPoint.proceed(new Object[]{normalized})
```

Events:

```text
around:argument-before="  Book  "
around:argument-after=book
target:normalizeArgument:item=book
```

The target really receives the new argument, not the original one.

This is a powerful capability, but it can also make contracts difficult to predict. Use it only when the transformation is an explicit part of the cross-cutting contract.

### `proceed(Object[])` in Spring AOP and AspectJ

This experiment runs on **proxy-based Spring AOP**. In this runtime, the array passed to:

```java
joinPoint.proceed(new Object[]{normalized})
```

represents the new argument list for the underlying method invocation, and its size must match the method arguments.

Do not assume that `proceed(Object[])` has identical semantics when advice is compiled by the AspectJ compiler. With AspectJ-compiled around advice, arguments passed to `proceed(...)` correspond to parameters bound into the around advice signature, so the rules for argument count and position differ from Spring AOP.

If an Aspect must be portable between Spring AOP and AspectJ, bind arguments explicitly in the pointcut/advice signature instead of relying on assumptions specific to one runtime.

---
