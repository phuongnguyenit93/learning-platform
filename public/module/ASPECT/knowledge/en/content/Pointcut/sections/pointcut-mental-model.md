Some common designators:

```text
execution(...)
→ matches method execution/signature

within(...)
→ matches a declaring type/package boundary

args(...)
→ matches the runtime argument shape

@annotation(...)
→ matches methods carrying a specific annotation

this(...)
→ matches the proxy type

target(...)
→ matches the target type

bean(...)
→ Spring-specific designator that matches by bean name
```

Pointcuts can also be named with `@Pointcut` and composed with:

```text
&&
||
!
```

Naming small pointcuts makes complex expressions easier to read than putting the entire rule into one long annotation.

The goal is not to make expressions as broad as possible. A pointcut should be narrow enough for behavior to remain predictable.
