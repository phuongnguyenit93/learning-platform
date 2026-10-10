Within one class, instance field initializers and instance blocks run in textual order before that class's constructor body.

```text
default zero/null state
→ field initializer / instance block
→ constructor body
```

Superclass construction still happens before the subclass portion.
