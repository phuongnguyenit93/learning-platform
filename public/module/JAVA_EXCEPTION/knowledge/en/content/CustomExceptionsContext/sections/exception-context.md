A useful custom exception often preserves its cause:

```java
public final class OrderLoadException extends RuntimeException {

    private final long orderId;

    public OrderLoadException(long orderId, Throwable cause) {
        super("Cannot load order " + orderId, cause);
        this.orderId = orderId;
    }

    public long getOrderId() {
        return orderId;
    }
}
```

Usage:

```java
catch (IOException ex) {
    throw new OrderLoadException(orderId, ex);
}
```

The exception now carries:

```text
type
→ OrderLoadException

structured context
→ orderId

message
→ human-facing diagnostic context

cause
→ original IOException
```

### A message is not structured context

If code needs the `orderId`, do not force callers to parse:

```text
"Cannot load order 42"
```

from a message.

A field/accessor is a stronger contract:

```java
ex.getOrderId()
```

Messages serve people and diagnostics; structured fields serve programmatic contracts.

### Keep secrets out of exceptions

Exceptions frequently reach logs, tracing, and monitoring.

Avoid embedding:

- passwords;
- access tokens;
- secret keys;
- full credentials;
- unnecessary sensitive payloads.

“Add useful context” does not mean “copy the entire request into the exception message”.
