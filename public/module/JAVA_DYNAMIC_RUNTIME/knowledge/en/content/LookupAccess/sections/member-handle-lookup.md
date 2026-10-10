`Lookup` exposes factories for executable handles:

```java
MethodHandle virtual =
        lookup.findVirtual(
                Greeter.class,
                "greet",
                MethodType.methodType(
                        String.class,
                        String.class
                )
        );

MethodHandle constructor =
        lookup.findConstructor(
                Greeter.class,
                MethodType.methodType(void.class)
        );
```

For `findConstructor`, the input `MethodType` uses `void` as the return type because it describes the constructor descriptor, but the returned handle's return type is the class being constructed. The example above therefore produces a `()Greeter` handle.

Fields can also be represented as **MethodHandle accessors**:

```java
MethodHandle getter =
        lookup.findGetter(
                User.class,
                "name",
                String.class
        );
```

But when the concern is **variable access semantics** such as volatile, acquire/release, or compare-and-set, VarHandle is the correct abstraction.

```text
field as callable getter/setter
→ MethodHandle accessor

field as variable with memory/access modes
→ VarHandle
```
