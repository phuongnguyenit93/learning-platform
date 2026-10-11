Controller:

```text
InfrastructureController#inspectInfrastructure()
```

Endpoint:

```text
GET /aop/advanced/infrastructure/inspect
```

Target:

```text
InfrastructureTargetService#execute()
```

Aspect:

```text
InfrastructureAspect#observe(...)
```

Response cho thấy:

```text
isAopProxy
isCglibProxy
isJdkDynamicProxy
runtimeClass
targetClass
advisors
autoProxyCreators
autoProxyCreatorPresent
springAopAutoExplicitlyConfigured
springAopAutoConfiguredValue
springAopProxyTargetClassExplicitlyConfigured
springAopProxyTargetClassConfiguredValue
```

Events:

```text
infrastructure-aspect:before
target:infrastructure
infrastructure-aspect:after
```

Điểm quan trọng là Controller không tạo proxy bằng tay. Proxy đã tồn tại khi bean được inject vào Controller.

Endpoint cố ý tách hai loại evidence:

```text
configuration evidence
→ property có được application cấu hình explicit không?
→ nếu có, configured value là gì?

runtime evidence
→ AutoProxyCreator có thật sự tồn tại không?
→ bean có thật sự là AOP proxy không?
→ proxy thực tế là CGLIB hay JDK dynamic proxy?
```

Nhờ vậy response không giả vờ rằng Boot default là một property value do application đã khai báo. Documented default và runtime observation là hai nguồn thông tin khác nhau.
