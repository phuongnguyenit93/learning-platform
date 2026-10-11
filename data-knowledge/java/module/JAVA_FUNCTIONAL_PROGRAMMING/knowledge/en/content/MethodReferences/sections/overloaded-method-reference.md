If the referenced name is overloaded, Java uses the target function type to select a compatible member. This often works naturally, but ambiguous target contexts can require a more explicit lambda or cast.

```java
Function<String, Integer> parseInt = Integer::valueOf;
Function<String, Long> parseLong = Long::valueOf;
```

The assignment provides enough information for each reference. Trouble appears when several overloads are compatible with the same surrounding call or when the target type itself is not yet known.

In those cases, a lambda can make parameter types or the exact call explicit and is often easier to debug than forcing a complicated cast around a method reference.
