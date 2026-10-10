### WHAT

**Identity** answers:

> Do these two references identify the exact same object?

**Logical equality** answers a different question:

> Should two different objects be treated as the same value or the same domain entity?

Java exposes two different mechanisms:

```text
==
→ for references: identity comparison

equals(...)
→ overridable logical-equality method
```

### WHY THE DISTINCTION MATTERS

Without this distinction, code can be syntactically valid but semantically wrong for the domain.

```java
UserId a = new UserId("U-100");
UserId b = new UserId("U-100");
```

There are two independent questions:

```text
Are a and b the exact same object?
→ identity

Do a and b represent the same user id?
→ logical equality
```

Collections such as `HashSet`, `HashMap`, and `TreeSet` cannot guess what “same” means in your domain. They rely on contracts supplied by the type or by the caller.

### REFERENCE, OBJECT, AND VALUE

A reference variable is not the object itself. A useful mental model is:

```text
UserId a ───────┐
                ├──> UserId("U-100")
UserId same ────┘

UserId b ──────────> UserId("U-100")
```

`a` and `same` share identity because they identify the same object. `a` and `b` have different identities even though their data is the same.
