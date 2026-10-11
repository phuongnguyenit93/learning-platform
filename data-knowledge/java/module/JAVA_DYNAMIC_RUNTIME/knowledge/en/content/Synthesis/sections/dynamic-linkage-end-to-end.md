End-to-end dynamic linkage:

```text
caller
  ↓
invokedynamic descriptor
  ↓
bootstrap(
    Lookup,
    name,
    MethodType,
    static args
)
  ↓
resolve/create MethodHandle target
  ↓
adapt target to exact call-site type
  ↓
create CallSite
  ↓
JVM links instruction to CallSite
  ↓
invoke current target
```

For a mutable call site:

```text
same linked CallSite
        ↓
target changes
        ↓
future invocations may observe the new target
```

This is the core synthesis of the invocation/linkage branch.
