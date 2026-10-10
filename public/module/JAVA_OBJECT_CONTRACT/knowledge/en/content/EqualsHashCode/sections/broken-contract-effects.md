A classic bug is overriding `equals` but keeping the inherited `hashCode` behavior:

```java
final class BrokenUserId {
    private final String value;

    BrokenUserId(String value) {
        this.value = value;
    }

    @Override
    public boolean equals(Object other) {
        return other instanceof BrokenUserId that
                && Objects.equals(value, that.value);
    }

    // intentionally no hashCode override
}
```

Two objects may then satisfy:

```text
a.equals(b) == true

but

a.hashCode() != b.hashCode()
```

Observable symptoms include:

- a `HashSet` that appears to contain duplicate logical values;
- `HashMap.get(equalKey)` missing an inserted entry;
- `contains` returning false even though a logically equal object is stored.

### THIS DOES NOT MEAN THE COLLECTION IS BROKEN

The collection operates under the documented assumption that keys honor their contract. It cannot reconstruct your domain equality semantics after the key violates that assumption.
