An API should make clear whether parameters, returns, or collection elements may be null and what null means.

Not every absence requires `Optional`, but ambiguous null contracts force callers to guess and often move failures far away from their cause.

If null violates an invariant, fail fast near the boundary:

```java
UserService(UserRepository repository) {
    this.repository = Objects.requireNonNull(repository);
}
```

Collection APIs should also define whether they return null or empty collections, whether null elements are allowed, and what a nullable argument means.

`Optional` can model absence for some return contracts, but it is not an automatic replacement for every nullable parameter/field. Consistent semantics matter more than mechanically eliminating the word `null`.

The next chapter explains wrapper types and why unboxing a null wrapper can fail.
