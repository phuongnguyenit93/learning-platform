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

`innerTrackedMethod()` is annotated with:

```text
@TrackExecution("self-invocation-inner")
```

The response returns two event groups.

### Self invocation

```text
target:outer-before-inner
target:innerTrackedMethod
target:outer-after-inner
```

There is no `track-before` because `outerCallsInner()` calls `innerTrackedMethod()` directly on the same object.

### External proxy invocation

The controller calls the bean directly with `selfInvocationService.innerTrackedMethod()`:

```text
track-before:label=self-invocation-inner
target:innerTrackedMethod
track-success:method=innerTrackedMethod
track-finished:elapsed-nanos=...
```

This time the invocation begins outside the target and passes through the proxy.
