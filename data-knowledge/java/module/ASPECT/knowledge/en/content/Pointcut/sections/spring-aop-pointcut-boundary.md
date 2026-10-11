Spring AOP uses the **AspectJ pointcut expression language**, but the runtime model is still proxy-based method interception.

Therefore, do not infer:

```text
Spring understands AspectJ pointcut syntax
→ Spring AOP supports every AspectJ join point
```

Designators associated with join points outside proxy method execution, such as:

```text
call(...)
get(...)
set(...)
initialization(...)
cflow(...)
cflowbelow(...)
```

are not part of the normal capability of proxy-based Spring AOP.

Correct mental model:

```text
AspectJ expression syntax
        ≠
full AspectJ weaving model
```

Chapter `15.RuntimeBoundary` connects this distinction to full AspectJ weaving.
