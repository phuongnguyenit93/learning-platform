Controller:

```text
RuntimeBoundaryController#inspectRuntimeBoundary()
```

Endpoint:

```text
GET /aop/advanced/runtime-boundary/inspect
```

Target:

```text
RuntimeBoundaryService#execute()
```

Aspect:

```text
RuntimeBoundaryAspect#around(...)
```

The response demonstrates these positive facts:

```text
The Aspect exists as a Spring bean
The injected target is an AOP proxy
The real target class can still be resolved behind the proxy
```

Events:

```text
runtime-aspect:join-point-kind=method-execution
runtime-aspect:before
target:runtime-boundary
runtime-aspect:after
```

`method-execution` comes directly from `JoinPoint#getKind()`, not from a hard-coded descriptive string in the controller.

The endpoint does not try to "prove with reflection" that every possible AspectJ weaving mode in the world is absent. That boundary is established by the module's build/runtime configuration itself.
