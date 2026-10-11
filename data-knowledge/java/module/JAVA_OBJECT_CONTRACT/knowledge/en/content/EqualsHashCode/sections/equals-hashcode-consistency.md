If equal objects return different hashes, `HashMap`/`HashSet` may search different regions and never reach the `equals` comparison.

Whenever `equals` is overridden, `hashCode` should be reviewed at the same time.

```text
equals == true
→ hashCode must match

hashCode matches
→ does not imply equals == true
```

### KEEP HASHING DERIVED FROM EQUALITY SEMANTICS

A design is easiest to reason about when `hashCode` is derived from the state that defines equality:

```java
final class UserId {
    private final String value;

    UserId(String value) {
        this.value = Objects.requireNonNull(value);
    }

    @Override
    public boolean equals(Object other) {
        return this == other
                || (other instanceof UserId that
                && Objects.equals(value, that.value));
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}
```

If equality later changes from `value` to `namespace + value`, `hashCode` must be reconsidered too so every newly equal pair still hashes alike. It does not mechanically have to include every equality field, but omitting useful fields may increase collisions and reduce hash-distribution quality.
