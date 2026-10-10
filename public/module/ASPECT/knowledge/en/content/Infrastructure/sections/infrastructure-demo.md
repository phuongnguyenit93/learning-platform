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

The response shows:

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

The important point is that the controller does not create the proxy manually. The proxy already exists when the bean is injected into the controller.

The endpoint intentionally separates two kinds of evidence:

```text
configuration evidence
→ was the property explicitly configured by the application?
→ if so, what was the configured value?

runtime evidence
→ does an AutoProxyCreator actually exist?
→ is the bean actually an AOP proxy?
→ is the real proxy CGLIB or JDK dynamic proxy?
```

This keeps the response from pretending that a Boot default is a property value explicitly declared by the application. Documented defaults and runtime observations are different sources of information.
