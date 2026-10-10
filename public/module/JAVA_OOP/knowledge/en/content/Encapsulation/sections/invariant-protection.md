### WHAT — what is an invariant?

An invariant is a condition that must remain true for a valid object. Examples:

```text
Account.balance >= 0
Order.total >= 0
ShoppingCart contains no quantity <= 0
```

Constructors or factories should establish valid state; every public operation that mutates state should preserve those invariants.

Think of the invariant lifecycle as a continuous chain:

```text
construction
→ object starts valid
→ every public state transition enforces required rules
→ object remains valid after the transition
```

If construction creates invalid state, or any public operation bypasses the rule, encapsulation has failed even if every field remains `private`.

### HOW — model state transitions instead of raw mutation

Instead of exposing a setter for each field, expose an operation with enough context to validate a complete transition:

```java
account.withdraw(30);
```

`withdraw` can validate the amount, balance, and business rules behind one boundary. The caller does not need to know how balance is represented.

### EVIDENCE — `EncapsulationController#invariantProtection()`

The module experiment creates an `Account` with balance `100`, withdraws `30`, then tries to withdraw another `100`.

The important observation is not just the exception. The evidence is:

```text
invalid request is rejected
        +
final balance is still valid
        =
the invariant is preserved
```

That is the concrete value of encapsulation: the object owns responsibility for its own state transitions.

### PRACTICE — find invariants before adding setters

Before adding a setter, ask: **does this field participate in a rule with other state?** If so, an intent-oriented operation is often safer than independent mutation.
