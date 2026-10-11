A correct `equals` implementation preserves several core properties:

```text
reflexive
x.equals(x) is true

symmetric
x.equals(y) and y.equals(x) agree

transitive
if x.equals(y) and y.equals(z) are true,
then x.equals(z) is true

consistent
the result stays stable while relevant state is unchanged

null
x.equals(null) is false
```

The compiler does not enforce these laws, but Java libraries **assume your objects honor them**.

### REFLEXIVE — AN OBJECT EQUALS ITSELF

If `x.equals(x)` could be false, basic reasoning inside equality-based APIs would break down.

This fast path is both correct and cheap:

```java
if (this == other) {
    return true;
}
```

### SYMMETRIC — BOTH DIRECTIONS MUST AGREE

If:

```text
a.equals(b) == true
```

then:

```text
b.equals(a) == true
```

Symmetry is especially easy to violate when inheritance lets a subtype add equality-relevant state.

### TRANSITIVE — EQUALITY MUST NOT BREAK THROUGH AN INTERMEDIATE VALUE

If:

```text
x.equals(y) == true
y.equals(z) == true
```

then:

```text
x.equals(z) == true
```

Transitivity lets callers treat equality as a stable relation instead of a contradictory chain of pairwise comparisons.

### CONSISTENT — SAME RELEVANT STATE, SAME ANSWER

An implementation based on current time, randomness, or external I/O could make the same two objects equal in one call and unequal in the next.

```java
// Anti-pattern: equality depends on time
return Instant.now().getEpochSecond() % 2 == 0;
```

That is a broken design because callers cannot use the object predictably.
