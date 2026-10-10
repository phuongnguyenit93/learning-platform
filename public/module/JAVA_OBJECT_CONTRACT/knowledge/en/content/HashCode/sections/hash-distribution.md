A useful hash combines equality-relevant fields so common inputs are distributed well enough for a hash-based collection to narrow candidate groups effectively.

The goal is **not a unique hash for every object**; uniqueness cannot be guaranteed in a finite `int` space.

```text
correctness
→ comes from the equals/hashCode contract

performance
→ is influenced by hash distribution
```

### COLLISION IS NOT A BUG

Different objects may deliberately or accidentally share a hash:

```java
final class DemoKey {
    private final int id;

    DemoKey(int id) {
        this.id = id;
    }

    @Override
    public int hashCode() {
        return 1; // deliberately poor distribution
    }

    @Override
    public boolean equals(Object other) {
        return other instanceof DemoKey that && id == that.id;
    }
}
```

A hash collection can remain correct because it still checks equality among candidate entries. Poor distribution mainly hurts performance by concentrating too many candidates in the same region.

### A HASH CODE IS NOT AN ID OR SECURITY TOKEN

Do not infer:

```text
same hash code → objects are equal?          false
hashCode → secure fingerprint?               false
hashCode → persistent identity?              false
```

Keep reference identity and hashing separate:

```text
reference identity (`==`)
→ are these references pointing to the exact same object?

hashCode()
→ input used by a hash-based collection to narrow where it must search
```

Two distinct objects can have the same hash code, and two distinct instances that are logically equal are required to have the same hash code. A hash code therefore cannot tell you whether two references have the same object identity.

`hashCode` primarily exists to support Java hash-based object contracts.

The next chapter combines `equals` and `hashCode` into **one operational contract** and shows what happens when the two methods disagree.
