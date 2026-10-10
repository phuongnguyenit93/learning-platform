Ở các chapter trước ta nhìn call chain như:

```text
Caller
→ Spring AOP Proxy
→ Advice
→ Target
```

`ProxyFactory` cho phép tự tạo chain đó bằng code:

```text
Target
  +
MethodInterceptor
  ↓
ProxyFactory
  ↓
Proxy
```

`MethodInterceptor` là một advice kiểu around ở tầng thấp hơn:

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

Mental model rất gần `ProceedingJoinPoint`:

```text
MethodInvocation.proceed()
→ tiếp tục interceptor chain
→ cuối cùng tới target
```
