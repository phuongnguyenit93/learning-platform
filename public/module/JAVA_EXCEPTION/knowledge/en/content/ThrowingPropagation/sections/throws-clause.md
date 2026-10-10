`throws` appears in a declaration:

```java
String load(Path path) throws IOException {
    return Files.readString(path);
}
```

It does **not** throw anything by itself. It declares that an exception may escape the method.

For checked exceptions, `throws` is required when the method does not catch the failure:

```java
String load(Path path) throws IOException {
    return Files.readString(path);
}
```

For unchecked exceptions, a declaration is legal but not required:

```java
void validate(String value) throws IllegalArgumentException {
    if (value.isBlank()) {
        throw new IllegalArgumentException("blank");
    }
}
```

Usually, do not list every imaginable `RuntimeException`. Declare or document unchecked failures when doing so materially clarifies the API contract.

### Multiple exceptions in throws

```java
void importData(Path path) throws IOException, ParseException {
    ...
}
```

The list should communicate useful failure categories. A broad `throws Exception` often loses information:

```text
caller knows "something can fail"
but
does not know which failure categories need which policies
```

When a method does not handle an exception, the failure does not disappear. Java **unwinds the call stack** while looking for a compatible handler in callers above it.

This is the bridge between `throw` and `try/catch`: `throw` creates abnormal completion at one point; propagation determines where that failure goes next.
