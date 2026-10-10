Controller:

```text
AnnotationDrivenController#trackByAnnotation()
```

Endpoint:

```text
GET /aop/annotation/track
```

Target:

```text
AnnotationDrivenService#executeTrackedOperation()
```

Aspect:

```text
TrackingAspect#track(...)
```

Pointcut:

```text
@annotation(trackExecution)
```

Event cho thấy Aspect đọc được cả annotation metadata lẫn method:

```text
track-before:label=annotation-demo
target:executeTrackedOperation
track-success:method=executeTrackedOperation
track-finished:elapsed-nanos=...
```
