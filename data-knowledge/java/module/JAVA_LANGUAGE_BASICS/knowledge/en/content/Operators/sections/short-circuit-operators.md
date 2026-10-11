`&&` and `||` short-circuit:

```java
user != null && user.isActive()
```

If the left side is false, the right side is not evaluated.

That is often part of correctness, not only an optimization. Boolean `&` and `|` evaluate both sides and therefore have different semantics.

Ordering matters for guards:

```java
if (user != null && user.isActive()) { }
```

Reversing the operands may dereference `user` before the null check. Avoid placing required side effects in a right-hand operand that may be skipped.

### Conditional operator `?:`

The conditional operator is an **expression** that produces a value:

```java
String label = active ? "ACTIVE" : "INACTIVE";
```

Its execution model is:

```text
evaluate condition
├─ true  → evaluate only the second operand
└─ false → evaluate only the third operand
```

Like short-circuit boolean operators, Java evaluates only **one** result expression:

```java
String name = user != null ? user.getName() : "anonymous";
```

The compiler determines the type of the whole conditional expression from both result operands using the applicable type/conversion rules. For multi-step decisions or deeply nested conditionals, `if/else` is usually easier to read.
