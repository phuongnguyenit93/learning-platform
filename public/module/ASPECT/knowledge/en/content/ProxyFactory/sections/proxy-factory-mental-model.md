In previous chapters, the call chain looked like:

```text
Caller
→ Spring AOP Proxy
→ Advice
→ Target
```

`ProxyFactory` lets us construct that chain directly in code:

```text
Target
  +
MethodInterceptor
  ↓
ProxyFactory
  ↓
Proxy
```

`MethodInterceptor` is a lower-level around-style advice:

```java
public Object invoke(MethodInvocation invocation) throws Throwable {
    before();
    try {
        return invocation.proceed();
    } finally {
        after();
    }
}
```

Its mental model is very close to `ProceedingJoinPoint`:

```text
MethodInvocation.proceed()
→ continue the interceptor chain
→ eventually reach the target
```
