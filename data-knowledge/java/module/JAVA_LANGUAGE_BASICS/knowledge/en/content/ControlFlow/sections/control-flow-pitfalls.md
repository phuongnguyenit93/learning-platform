Readability suffers with deeply nested branches, side effects inside long conditions, accidental switch fall-through, or many exits spread across several loop levels.

Guard clauses, extracted methods, data-driven design, or polymorphism may express the decision more clearly.

Guard clauses can flatten the happy path:

```java
if (user == null) return;
if (!user.isActive()) return;
process(user);
```

For condition-controlled loops, make the termination mechanism visible. Infinite loops may be intentional, but then the surrounding design should provide an explicit stop/interrupt mechanism where appropriate.

The next chapter introduces arrays, where enhanced-for can be studied against a concrete sequence type.
