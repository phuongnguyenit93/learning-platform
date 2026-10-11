Use the creation method that matches what you know about the value.

```java
Optional<String> none = Optional.empty();
Optional<String> known = Optional.of("Java");
Optional<String> maybe = Optional.ofNullable(valueFromLegacyApi);
```

`Optional.of(value)` requires `value` to be non-null and throws `NullPointerException` otherwise. `Optional.ofNullable(value)` converts `null` to `Optional.empty()`.

Choose deliberately. Using `ofNullable` everywhere can hide a bug when the value was supposed to be non-null.

For primitive-heavy APIs, the JDK also provides `OptionalInt`, `OptionalLong`, and `OptionalDouble`. They express optional primitive results without wrapping the payload in `Integer`, `Long`, or `Double`. They are separate types with smaller APIs, not subclasses of `Optional<T>`.
