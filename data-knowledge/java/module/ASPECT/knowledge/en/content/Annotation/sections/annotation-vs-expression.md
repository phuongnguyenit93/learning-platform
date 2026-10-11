Annotations are a good fit when the behavior can be treated as an explicit contract:

```text
@TrackExecution
@Audited
@Measured
```

This is often easier to read than a pointcut that depends deeply on package structure or method naming conventions.

However, the annotation does not guarantee that advice will run. The invocation still has to pass through the proxy.
