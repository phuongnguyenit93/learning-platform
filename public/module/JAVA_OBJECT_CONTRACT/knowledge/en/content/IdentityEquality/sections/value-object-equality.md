A value object is usually identified by its **meaningful value**, not by object identity.

Two `Money(100, "USD")` instances may be logically equal even if they were constructed independently.

### VALUE OBJECT VS ENTITY

A useful model is:

```text
Value object
→ "what value does it carry?"

Entity
→ "which domain entity is it?"
```

`Money(100, "USD")` is commonly value-equal by amount and currency. A `User` may instead be equal by a stable `userId`, not by every mutable field such as display name or last-login time.

The important rule is to choose equality from **domain meaning**, not by blindly including every field an IDE can see.

### EQUALITY STATE SHOULD BE STABLE

A sound equality design usually:

- uses the components that truly define the value or domain identity;
- preserves reflexive, symmetric, transitive, and consistent behavior;
- keeps `hashCode` behavior consistent with equality, so objects considered equal always produce the same hash code;
- avoids mutating equality state while the object is used as a hash/sorted key.

If `UserId` is defined solely by `value`, both equality and hashing should be based on that same `value`.

### TRANSITION

We now know that **logical equality is a domain/type decision rather than reference identity**. The next chapter defines the exact laws `equals` must preserve so Java libraries can trust that decision.
