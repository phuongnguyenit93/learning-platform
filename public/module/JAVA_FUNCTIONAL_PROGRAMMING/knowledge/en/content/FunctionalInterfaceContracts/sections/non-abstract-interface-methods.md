`default`, `static`, and `private` interface methods already have implementations, so they do not add another abstract behavior that a lambda must supply.

`default` and `static` interface methods are available from Java 8. Private interface methods were added in Java 9, so the `private static` helper in the example below is not valid when compiling with Java 8 source compatibility.

```java
@FunctionalInterface
interface TextFormatter {
    String format(String value);

    default String formatTrimmed(String value) {
        return format(value.trim());
    }

    static TextFormatter identity() {
        return value -> value;
    }

    private static boolean missing(String value) {
        return value == null;
    }
}
```

Only `format` is the functional contract. The other methods can support convenience behavior, factories, or internal implementation without changing the SAM.

Do not use this as a reason to overload a functional interface with unrelated helpers. The interface should still communicate one clear behavior to callers.
