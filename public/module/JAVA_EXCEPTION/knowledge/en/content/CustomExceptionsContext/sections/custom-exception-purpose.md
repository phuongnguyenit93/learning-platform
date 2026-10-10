A custom exception can be useful when it:

- expresses a domain/application failure in the right vocabulary;
- hides lower-level implementation details;
- gives callers a meaningful category to catch;
- carries structured context that plain message text cannot represent well;
- creates a more stable contract than the underlying library/infrastructure exceptions.

Suppose a repository may later switch from files to a database. The service may not want callers coupled to `IOException` or `SQLException`.

```java
try {
    return repository.load(orderId);
} catch (IOException ex) {
    throw new OrderLoadException(orderId, ex);
}
```

The caller sees:

```text
OrderLoadException
```

rather than knowing that the repository currently uses files.

### When is a custom type unnecessary?

Avoid creating:

```java
class InvalidArgumentForOrderException extends RuntimeException {
}
```

merely to rename `IllegalArgumentException` when the new type adds no:

- domain meaning;
- structured context;
- handling policy;
- abstraction boundary.

A large set of classes that differ only by name makes an API harder to understand without adding expressiveness.

### Checked or unchecked custom exception?

Both are valid.

Unchecked:

```java
class OrderLoadException extends RuntimeException {
}
```

Checked:

```java
class OrderLoadException extends Exception {
}
```

The choice returns to the checked/unchecked design question:

```text
Should the compiler force every caller to catch or declare this failure?
```

Do not choose purely from slogans such as “custom exceptions should extend RuntimeException” or “business exceptions should be checked”.
