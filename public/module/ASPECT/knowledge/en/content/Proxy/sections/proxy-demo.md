Controller:

```text
ProxyMentalModelController#inspectProxy()
```

Endpoint:

```text
GET /aop/proxy/inspect
```

Target:

```text
ProxyMentalModelService#invokeTarget()
```

Aspect:

```text
ProxyMentalModelAspect#observeProxyBoundary(...)
```

The response `facts` includes:

```text
runtimeClass
targetClass
isAopProxy
isCglibProxy
isJdkDynamicProxy
```

The response `events` shows the call chain:

```text
proxy-boundary:before-target
target:invokeTarget
proxy-boundary:after-target
```

Do not try to guess the generated proxy class name. Use `AopUtils` to inspect semantics instead of depending on runtime class naming.
