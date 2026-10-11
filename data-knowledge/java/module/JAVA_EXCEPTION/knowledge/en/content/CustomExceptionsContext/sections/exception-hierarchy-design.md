A small hierarchy can let callers handle at different levels:

```text
OrderException
├── OrderNotFoundException
└── OrderValidationException
```

A caller that wants one policy for all order failures can catch:

```java
catch (OrderException ex) {
    handleOrderFailure(ex);
}
```

A caller that needs a specific policy can catch:

```java
catch (OrderNotFoundException ex) {
    showNotFound(ex);
}
```

### Design the hierarchy around handling policy

Do not mirror every internal implementation class:

```text
JdbcOrderTableReadException
JdbcOrderColumnMappingException
JdbcOrderConnectionAcquireException
...
```

if callers only have one meaningful policy:

```text
"the order could not be loaded"
```

A good hierarchy asks:

```text
Does the caller need to distinguish these failures
because it will act differently?
```

If not, separate types may be over-design.

### Constructors should support the causal chain

A base exception often needs only the constructors its contract actually uses:

```java
OrderException(String message) {
    super(message);
}

OrderException(String message, Throwable cause) {
    super(message, cause);
}
```

There is no requirement to copy every constructor from `RuntimeException`.

### REMEMBER

```text
custom type
→ semantic contract

context field
→ structured data

cause
→ root diagnostics

hierarchy
→ caller-oriented handling categories
```

The next chapter focuses on application exception boundaries: where should code catch, translate, log, retry, recover, or propagate?
