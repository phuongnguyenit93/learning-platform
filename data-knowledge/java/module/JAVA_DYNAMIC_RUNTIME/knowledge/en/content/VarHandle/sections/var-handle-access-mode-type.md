Like MethodHandle, VarHandle access-mode methods are **signature-polymorphic**.

An access-mode type is derived from:

```text
coordinate types
+
variable type
+
access mode
```

For an instance field `int value`:

```text
coordinates: (Counter)
variable:    int

GET
→ (Counter)int

SET
→ (Counter,int)void

COMPARE_AND_SET
→ (Counter,int,int)boolean
```

The API exposes this directly:

```java
MethodType getType =
        handle.accessModeType(
                VarHandle.AccessMode.GET
        );
```

An incompatible call-site signature can result in `WrongMethodTypeException`.

By default, VarHandle access-mode invocation uses **invoke behavior**: the runtime can apply conversions comparable to `MethodHandle.invoke`/`asType` when the symbolic descriptor is not an exact match but can be adapted to the access-mode type.

```java
VarHandle exact = handle.withInvokeExactBehavior();
```

That view uses **invoke-exact behavior**: the call site must match the `accessModeType` exactly or `WrongMethodTypeException` is thrown. `hasInvokeExactBehavior()` reports the mode, and `withInvokeBehavior()` restores the default invoke-style behavior.
