A checked exception is subject to the **catch-or-declare** rule.

If a checked exception may escape a method, the code must:

```text
catch it
or
declare it with throws
```

Example:

```java
String read(Path path) throws IOException {
    return Files.readString(path);
}
```

`Files.readString(path)` may throw `IOException`. If `read()` does not catch it, `read()` must declare it.

The caller then has to choose:

```java
try {
    String content = read(path);
} catch (IOException ex) {
    recover(ex);
}
```

or continue the contract:

```java
String load(Path path) throws IOException {
    return read(path);
}
```

### WHY CHECKED EXCEPTIONS EXIST

The idea is to move a failure possibility into the **compile-time API contract**:

```text
method has a failure callers are expected to acknowledge
        ↓
compiler forces handling or further declaration
```

That can be useful when callers can make a meaningful choice: select another file, switch to a fallback source, report input failure, or deliberately abort the operation.

The cost appears when callers cannot realistically recover. If every intermediate method merely repeats:

```java
throws SomeCheckedException
```

without adding any policy or abstraction, the checked contract can become boilerplate rather than useful information.
