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

Response `facts` cho biết:

```text
runtimeClass
targetClass
isAopProxy
isCglibProxy
isJdkDynamicProxy
```

Response `events` cho thấy call chain:

```text
proxy-boundary:before-target
target:invokeTarget
proxy-boundary:after-target
```

Không cần cố đoán tên generated proxy class. Hãy dùng `AopUtils` để kiểm tra semantics thay vì phụ thuộc tên class runtime.
