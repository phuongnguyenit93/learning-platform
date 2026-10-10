```java
enum AccountStatus {
    ACTIVE, FROZEN, CLOSED
}
```

`AccountStatus.ACTIVE` is a singleton object defined by the enum contract, not an integer alias.

Because each constant has stable identity, `==` is appropriate and commonly preferred for enum comparison.
