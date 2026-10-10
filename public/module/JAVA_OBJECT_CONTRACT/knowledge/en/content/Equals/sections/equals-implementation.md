A value-style implementation commonly follows this flow:

```text
1. same identity?             → true immediately
2. compatible type?          → otherwise false
3. compare equality state    → logical equality result
```

```java
import java.util.Objects;

final class UserId {
    private final String value;

    UserId(String value) {
        this.value = Objects.requireNonNull(value);
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof UserId that)) return false;
        return Objects.equals(value, that.value);
    }
}
```

> This snippet intentionally focuses on `equals`. A complete value type that overrides `equals` must also provide a `hashCode` implementation that preserves the rule “equal objects produce equal hash codes”; the next two chapters build that part of the contract explicitly.

### OVERRIDE, DO NOT ACCIDENTALLY OVERLOAD

The `Object` contract uses this signature:

```java
public boolean equals(Object other)
```

Writing:

```java
public boolean equals(UserId other) {
    ...
}
```

creates an **overload**, not an override. Calls made through `Object`, collections, or standard APIs may still use `Object.equals()` rather than the method you intended to replace.

Prefer keeping `@Override` on the method:

```java
@Override
public boolean equals(Object other) {
    ...
}
```

so the compiler catches a wrong signature immediately.

### WHICH FIELDS BELONG IN EQUALITY?

There is no rule that says every field must participate. Ask:

> Which state actually defines this value or entity in the domain?

A `User` may contain:

```text
userId       → stable domain identity
displayName  → mutable presentation state
lastLoginAt  → operational state
```

If `User` equality represents domain identity, including `lastLoginAt` would make the same user become “different” merely because they logged in.

### MUTABLE EQUALITY STATE

The `equals` consistency rule says repeated comparisons should agree **while equality-relevant state remains unchanged**. It does not mean an object whose equality state changes must keep returning the old result.

For example, if equality includes a mutable `email` field:

```text
before change
user.email = "a@example.com"
→ user may equal another object with the same email

after change
user.email = "b@example.com"
→ that equality result may legitimately change
```

The design risk is therefore not “mutation automatically violates `equals`”. The risk is that the meaning of **which logical value/entity this object represents can move over time**, making reasoning, deduplication, caching, and later hash/sorted-key usage harder to keep predictable.

Prefer equality state that is stable for the lifetime in which callers rely on that identity/value meaning. The `equals/hashCode` chapter later shows the especially visible failure that occurs when equality/hash state changes after insertion into a hash-based collection.

### `instanceof` OR `getClass()`?

The two approaches express different policies.

```java
if (!(other instanceof UserId that)) return false;
```

allows compatible subtypes to participate, while:

```java
if (other == null || getClass() != other.getClass()) return false;
```

requires the exact runtime class.

There is no universal template that is right for every hierarchy. The chosen policy must preserve symmetry/transitivity and match the domain. `final` value classes or closed hierarchies often make the contract easier to maintain.

### `equals` AND NULL

For a non-null reference `x`:

```java
x.equals(null) // must be false
```

Calling a method on a null reference fails before `equals` can run:

```java
UserId x = null;
x.equals(other); // NullPointerException
```

`Objects.equals(a, b)` is useful when the caller needs null-safe equality.
