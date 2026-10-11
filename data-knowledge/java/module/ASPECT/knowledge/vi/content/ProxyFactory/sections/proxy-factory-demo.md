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

Cả hai proxy đều tạo event cho `greet(...)`:

```text
interceptor-before:greet
target:greet:...
interceptor-after:greet
```

Nhưng `facts` cho thấy một object là JDK dynamic proxy và object còn lại là CGLIB proxy.

Nhánh CGLIB còn có thêm:

```text
interceptor-before:targetOnlyCapability
target:targetOnlyCapability
interceptor-after:targetOnlyCapability
```

Trong khi JDK proxy không expose method đó qua `GreetingOperations`.
