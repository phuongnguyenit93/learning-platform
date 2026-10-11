For a `try` with multiple handlers, Java checks them in source order and selects the first `catch` whose parameter type can accept the thrown exception.

```java
try {
    load();
} catch (FileNotFoundException ex) {
    handleMissingFile(ex);
} catch (IOException ex) {
    handleOtherIo(ex);
}
```

`FileNotFoundException` is a subtype of `IOException`, so the specific handler must come first.

This is invalid:

```java
try {
    load();
} catch (IOException ex) {
    handleIo(ex);
} catch (FileNotFoundException ex) { // unreachable
    handleMissingFile(ex);
}
```

The compiler knows every `FileNotFoundException` would already have matched the broader `IOException` handler.

### Type is a better contract than parsing messages

Avoid policies such as:

```java
catch (IOException ex) {
    if (ex.getMessage().contains("not found")) {
        ...
    }
}
```

Messages are diagnostic text and may change. If callers need different behavior, exception types or structured context are usually a stronger contract.
