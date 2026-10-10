`@Order` is useful when multiple cross-cutting concerns need explicit precedence, but a dependency chain such as:

```text
Aspect A must run before B,
B must change data for C,
C must run before D
```

is a sign that the design is becoming difficult to understand.

Business rules should live in explicit abstractions/services rather than turning advice ordering into a hidden workflow engine.

The Pointcut chapter intentionally contains two advice methods using `this(...)` and `target(...)` that can both match without using their observed ordering as a learning contract. This is an example of the same principle.
