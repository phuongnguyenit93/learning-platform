When functional code meets a checked exception, choose an adaptation that matches the API boundary instead of hiding the failure mechanically.

One option is to translate the checked exception into an appropriate unchecked exception:

```java
Function<Path, String> reader = path -> {
    try {
        return Files.readString(path);
    } catch (IOException ex) {
        throw new UncheckedIOException(ex);
    }
};
```

Another option is a domain-specific functional interface whose contract declares the checked exception:

```java
@FunctionalInterface
interface IOFunction<T, R> {
    R apply(T value) throws IOException;
}
```

You can also keep the operation in an ordinary method where checked-exception handling is clearer. Avoid generic "sneaky throw" helpers that bypass the visible contract; they make callers and tooling reason about a different failure model from the one the type declares.
