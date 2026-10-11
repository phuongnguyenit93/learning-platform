```text
around before
    ↓
proceed()
    ↓
target method
    ↓
return / exception
    ↓
around after
```

`ProceedingJoinPoint#proceed()` transfers execution to the next advice or to the target.

Therefore `@Around` can:

- measure execution time;
- inspect arguments;
- change arguments before continuing the invocation;
- observe the return value;
- change the return value;
- decide not to call the target;
- propagate or transform exceptions.

This power also makes behavior easier to make surprising when `@Around` is overused.
