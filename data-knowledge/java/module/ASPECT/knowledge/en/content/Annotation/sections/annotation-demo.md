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

The events show that the Aspect can read both annotation metadata and the method:

```text
track-before:label=annotation-demo
target:executeTrackedOperation
track-success:method=executeTrackedOperation
track-finished:elapsed-nanos=...
```
