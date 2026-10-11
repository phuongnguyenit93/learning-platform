Since Java 9, an existing local variable can appear directly in the resource specification if it is `final` or effectively final:

```java
InputStream in = Files.newInputStream(path);

try (in) {
    consume(in);
}
```

Effectively final means the variable is not reassigned after initialization.

This is not effectively final:

```java
InputStream in = Files.newInputStream(path);
in = anotherStream;

try (in) {
    ...
}
```

### Ownership still matters

The syntax allowing an existing variable does not mean every method receiving an `AutoCloseable` should close it.

Ask:

```text
Who created the resource?
Who owns its lifecycle?
Who is responsible for closing it?
```

If a method only borrows a caller-owned resource, closing it may violate the caller's contract.

The next chapter moves from resource/failure mechanics to API and domain design: when does a custom exception type add real meaning?
