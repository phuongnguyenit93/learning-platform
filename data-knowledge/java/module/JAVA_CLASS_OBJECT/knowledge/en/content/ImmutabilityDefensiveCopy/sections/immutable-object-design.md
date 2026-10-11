An immutable object usually:

- establishes all state in a constructor/factory;
- exposes no mutator that changes state;
- uses `final` fields when appropriate;
- prevents mutable internal state from leaking;
- restricts extension when subclasses could violate immutability.

```java
final class BankAccountSnapshot {
    private final String id;
    private final List<String> tags;

    BankAccountSnapshot(String id, List<String> tags) {
        this.id = id;
        this.tags = new ArrayList<>(tags);
    }

    List<String> tags() {
        return List.copyOf(tags);
    }
}
```

This immutable variant of the running account example establishes all state during construction and never exposes its mutable internal list directly.

Immutability simplifies sharing, caching, hashing, and concurrency reasoning.
