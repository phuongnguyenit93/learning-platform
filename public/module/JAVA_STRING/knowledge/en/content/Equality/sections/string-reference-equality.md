For references, `==` only asks whether both variables identify the same object.

Pooling may make some literals share identity, but correct text comparison should not depend on that optimization.

Mental model:

```text
a ─────► String object #1: "java"

b ─────► String object #2: "java"

a == b
→ are object #1 and object #2 the same object?

a.equals(b)
→ do they represent the same text sequence?
```

Use `==` with String only when identity is genuinely the thing being observed, such as a pool/intern experiment.
