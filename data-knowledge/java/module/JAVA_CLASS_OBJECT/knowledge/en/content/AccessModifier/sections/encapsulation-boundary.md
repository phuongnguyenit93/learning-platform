`private` does not automatically create good design, but access control is a core tool for reducing coupling.

A useful heuristic:

```text
member does not need to be public
→ do not make it public merely for convenience

state has invariants
→ avoid exposing unrestricted mutation
```

A smaller API surface gives fewer callers direct dependence on implementation details.
