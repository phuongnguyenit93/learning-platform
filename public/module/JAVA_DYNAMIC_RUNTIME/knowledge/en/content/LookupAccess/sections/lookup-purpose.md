`MethodHandles.Lookup` is a factory for creating MethodHandles or VarHandles when creation requires access checking. The key rule is: **member access is checked when the handle is created, not on every invocation of the handle**.

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();
```

A Lookup carries a lookup class and a set of lookup modes. It therefore behaves like a capability object: code holding a particular Lookup can create only the handles allowed by that capability.

```text
caller / lookup class
        +
lookup modes
        ↓
Lookup capability
        ↓
findVirtual / findStatic / findConstructor / findVarHandle ...
        ↓
access checking occurs here
        ↓
created handle can invoke without repeating Java member access checks
```

That is why Lookup is more than a utility that “finds methods.”
