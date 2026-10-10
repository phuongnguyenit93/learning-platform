One way to read the call chain is:

```text
Controller
→ AOP Proxy
→ Pointcut selects a Join Point
→ Advice executes
→ Target Object
```

An Aspect groups cross-cutting behavior; Advice is the concrete behavior that runs at a join point selected by a pointcut.
