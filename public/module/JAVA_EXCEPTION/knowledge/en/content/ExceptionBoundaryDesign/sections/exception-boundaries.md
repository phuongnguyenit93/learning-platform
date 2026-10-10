Low-level failures often use implementation vocabulary:

```text
SQLException
IOException
SocketTimeoutException
```

A higher layer may need application/domain vocabulary:

```text
OrderRepositoryException
DocumentLoadException
PaymentUnavailableException
```

Example:

```java
Order loadOrder(long orderId) {
    try {
        return repository.load(orderId);
    } catch (SQLException ex) {
        throw new OrderRepositoryException(
                "Cannot load order " + orderId,
                ex
        );
    }
}
```

### WHY TRANSLATE?

If a service contract exposes `SQLException` directly, callers become coupled to the storage technology.

If the repository later moves from JDBC to files or a remote API, that infrastructure change can leak into callers.

Translation creates a boundary:

```text
implementation detail
→ ends at the boundary

application meaning
→ continues to callers
```

But translation must preserve the cause; otherwise abstraction improves while diagnostics become worse.

### Do not wrap at every layer

Avoid chains such as:

```text
SQLException
→ RepositoryException
→ ServiceException
→ ControllerException
```

when every wrapper merely renames the same failure.

Wrap when a layer adds real value such as:

- abstraction meaning;
- a handling category;
- useful context;
- a stable public contract.

A chain such as:

```text
IOException
→ MyIOException
→ ServiceIOException
→ ControllerIOException
```

adds no value if each wrapper only renames the same failure.

### Rethrow or wrap?

If the abstraction does not change, rethrowing the same exception may be appropriate:

```java
catch (IOException ex) {
    audit(ex);
    throw ex;
}
```

If the abstraction changes, wrapping with an appropriate type while preserving the cause may be clearer:

```java
catch (IOException ex) {
    throw new OrderLoadException("Cannot load order file", ex);
}
```

Do not create a wrapper merely because a catch block exists.
