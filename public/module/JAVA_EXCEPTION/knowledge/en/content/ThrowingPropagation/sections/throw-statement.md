`throw` transfers control away from the current execution path.

```java
if (amount < 0) {
    throw new IllegalArgumentException("amount must be >= 0");
}
```

After the `throw` executes:

1. the next statement in the current block does not run;
2. Java looks for a compatible `catch`;
3. if none exists locally, the current method is left;
4. the exception propagates to the caller.

### `throw` does not require creating a new object

Normally, the expression after `throw` must be compatible with `Throwable`.

A language edge case is `throw null;`: it still compiles, but at runtime Java throws a `NullPointerException` at that `throw` statement.

Create a new throwable:

```java
throw new IOException("cannot read");
```

or rethrow an existing one:

```java
catch (IOException ex) {
    audit(ex);
    throw ex;
}
```

So the precise model is:

```text
throw <Throwable expression>
```

not “`throw` must always be followed by `new Exception(...)`”.

### Throw changes normal execution

```java
void validate(int quantity) {
    if (quantity < 0) {
        throw new IllegalArgumentException("quantity < 0");
    }

    save(quantity);
}
```

If `quantity < 0`, `save(quantity)` is never called. The exception both carries failure information and moves execution away from the success path.
