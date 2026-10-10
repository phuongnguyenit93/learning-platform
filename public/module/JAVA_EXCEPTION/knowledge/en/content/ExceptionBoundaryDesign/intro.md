# Designing Exception Boundaries

Knowing `try/catch` syntax is not enough to design a good failure flow. The larger question is:

```text
Which layer has enough context
and enough responsibility
to do something meaningful with this failure?
```

Good exception design preserves three things at once:

```text
correct control flow
+ correct abstraction
+ sufficient diagnostics
```
