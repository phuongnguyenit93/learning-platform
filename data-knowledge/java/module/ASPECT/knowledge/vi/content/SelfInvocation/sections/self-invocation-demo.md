Controller:

```text
SelfInvocationController#compareSelfInvocation()
```

Endpoint:

```text
GET /aop/self-invocation/compare
```

Target methods:

```text
SelfInvocationService#outerCallsInner()
SelfInvocationService#innerTrackedMethod()
```

`innerTrackedMethod()` mang:

```text
@TrackExecution("self-invocation-inner")
```

Response trả hai nhóm event.

### Self invocation

```text
target:outer-before-inner
target:innerTrackedMethod
target:outer-after-inner
```

Không có `track-before` vì `outerCallsInner()` gọi `innerTrackedMethod()` trực tiếp trên cùng object.

### External proxy invocation

Controller gọi trực tiếp bean `selfInvocationService.innerTrackedMethod()`:

```text
track-before:label=self-invocation-inner
target:innerTrackedMethod
track-success:method=innerTrackedMethod
track-finished:elapsed-nanos=...
```

Lần này invocation bắt đầu từ bên ngoài target và đi qua proxy.
