A bootstrap method is invoked by the JVM to link a dynamic call site. A common shape is:

```java
static CallSite bootstrap(
        MethodHandles.Lookup lookup,
        String name,
        MethodType type
) throws Throwable
```

Additional static arguments may also be passed from the class file.

The bootstrap typically:

1. inspects the context (`Lookup`, symbolic name, `MethodType`, static args);
2. resolves or creates a target MethodHandle;
3. adapts the target to the exact call-site type if required;
4. returns a CallSite.

```java
MethodHandle target = ...;
target = target.asType(type);
return new ConstantCallSite(target);
```

Bootstrap code should perform **linkage work**, not business logic that is meant to execute on every invocation.
