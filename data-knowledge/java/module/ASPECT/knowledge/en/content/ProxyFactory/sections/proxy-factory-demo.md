Controller:

```text
ProgrammaticProxyController#compareProxyFactoryStrategies()
```

Endpoint:

```text
GET /aop/advanced/proxy-factory/compare
```

Service:

```text
ProgrammaticProxyService#compareProxyStrategies()
```

Interceptor:

```text
TracingMethodInterceptor#invoke(...)
```

Both proxies produce events for `greet(...)`:

```text
interceptor-before:greet
target:greet:...
interceptor-after:greet
```

But `facts` shows that one object is a JDK dynamic proxy and the other is a CGLIB proxy.

The CGLIB branch also contains:

```text
interceptor-before:targetOnlyCapability
target:targetOnlyCapability
interceptor-after:targetOnlyCapability
```

while the JDK proxy does not expose that method through `GreetingOperations`.
