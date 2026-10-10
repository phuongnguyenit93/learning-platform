Choose a fallback based on whether it is cheap, expensive, optional-producing, or exceptional.

```java
String a = userName.orElse("anonymous");
String b = userName.orElseGet(this::loadDefaultName);
Optional<String> c = userName.or(this::lookupSecondaryName);
String d = userName.orElseThrow(UserNotFoundException::new);
```

`orElse(value)` evaluates its argument before the call, even when the `Optional` is present. `orElseGet(supplier)` calls the supplier only when the value is absent. That difference matters for expensive work or side effects.

`or` is the lazy alternative when the fallback itself is another `Optional`. `orElseThrow` makes absence a failure and can supply an exception appropriate to the API boundary.

`Optional.or` was also added in Java 9. If a project must retain Java 8 source compatibility, do not assume that every method in the current `Optional` API exists in that release.
