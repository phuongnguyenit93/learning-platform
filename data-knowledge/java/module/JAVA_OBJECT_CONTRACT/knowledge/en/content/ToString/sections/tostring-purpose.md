Every class inherits `toString()` from `Object` unless it overrides the method.

### DEFAULT `Object.toString()`

The default representation is roughly shaped as:

```text
fully.qualified.ClassName@hexHash
```

For example:

```text
com.example.UserId@5e2de80c
```

The suffix after `@` comes from `hashCode()` rendered in hexadecimal; it is **not a unique object identifier** and collisions are possible. The default representation can still be a rough diagnostic token, but it usually does not expose meaningful domain state.

The default `Object.toString()` representation is not a stable persistence format and should not be treated as one across JVM executions. A class is free to override `toString()` and intentionally document a stable format, but callers should only rely on such stability when the class explicitly makes that promise.

Domain classes therefore often override it:

```java
@Override
public String toString() {
    return "UserId[value=" + value + "]";
}
```

producing something closer to:

```text
UserId[value=U-100]
```

### WHY IS `toString` A CONTRACT?

The JDK does not require one exact application-specific format. At the `Object` level, `toString` is expected to return a textual representation of the object, and the documentation recommends a concise but informative result that is easy for a person to read.

On top of that formal API expectation, production code usually applies additional **engineering guidance** because tooling and caller code may invoke the method in diagnostic paths. A practical `toString` should therefore:

- return a useful description;
- avoid surprising side effects;
- be cheap and safe enough for diagnostics;
- avoid exposing data that should remain private.

The last three bullets are not separate language-level laws enforced by Java. They are design constraints that keep the method safe and useful in real logging/debugging environments.

### `toString` MAY BE INVOKED INDIRECTLY

You do not always call `.toString()` explicitly:

```java
System.out.println(userId);

String message = "id=" + userId;

logger.info("processing {}", userId);
```

Different APIs have different invocation details, but the important mental model is that object representation may surface in many places beyond direct calls.
