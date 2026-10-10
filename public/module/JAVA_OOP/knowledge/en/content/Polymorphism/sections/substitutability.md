### WHAT — compiling is not enough

The type system may allow `Child` to be assigned to `Parent`, but the design is truly polymorphic only if callers still receive reasonable behavior according to the `Parent` contract.

A subtype should preserve important expectations such as:

- valid inputs are not arbitrarily narrowed;
- postconditions callers rely on still hold;
- important invariants remain valid;
- side effects and error semantics do not violate the contract's assumptions.

This is close to Liskov Substitution Principle reasoning, but at Java Core level the practical question is: **if we swap the implementation without telling the caller, does behavior remain valid?**

### FAILURE CASE — type-compatible but behaviorally incompatible

Suppose the `Account` contract reasonably leads callers to expect that every account supports `withdraw(...)`:

```java
class Account {
    void withdraw(int amount) {
        // normal withdrawal contract
    }
}

class FixedAccount extends Account {
    @Override
    void withdraw(int amount) {
        throw new UnsupportedOperationException();
    }
}
```

Java still permits:

```java
Account account = new FixedAccount();
```

But if every `Account` caller must add a special branch for `FixedAccount`, the subtype no longer preserves the shared behavioral expectation.

```text
assignable in the type system
≠
substitutable under the behavioral contract
```

### EVIDENCE — `SubstitutabilityController#substituteImplementations()`

The experiment passes multiple implementations through one method that accepts `Formatter`:

```text
run(new Upper())
run(new Lower())
```

The caller depends only on the `Formatter` contract; implementations can change without special-casing the `run(...)` flow.

### PRACTICE — a sign of weak substitutability

If code frequently needs:

```java
if (payment instanceof SpecialPayment) {
    // exception path only because this subtype does not fit the shared contract
}
```

reconsider the abstraction or subtype relationship.

### RELATION — the next question

We have now seen runtime dispatch. But Java also has **overloading** selected at compile time, static-method hiding, and field hiding. Without separating those mechanisms, polymorphism is easy to misunderstand. The next chapter does exactly that.
