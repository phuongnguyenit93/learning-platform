An `Optional` should itself normally be non-null. Returning `null` instead of `Optional.empty()` defeats the contract because callers now have two different forms of absence to handle.

`Optional` also defines how `null` interacts with transformations:

- `map` turns a `null` mapper result into `Optional.empty()`;
- `flatMap` expects the mapper itself to return a non-null `Optional` and throws `NullPointerException` if it returns `null`.

```java
Optional<String> name = Optional.of("Java");
Optional<Integer> length = name.map(String::length);
```

At boundaries with older APIs that may return `null`, `ofNullable` is the usual bridge into an `Optional`-based flow.
