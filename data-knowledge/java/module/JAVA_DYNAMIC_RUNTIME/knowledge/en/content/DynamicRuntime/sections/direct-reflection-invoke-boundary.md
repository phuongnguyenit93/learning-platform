These mechanisms sit near one another but solve different problems:

| Mechanism | Best fit | Main characteristic |
| --- | --- | --- |
| Direct call | Type and target are ordinary compile-time code | Simplest and clearest |
| Reflection | Runtime metadata/member inspection or metadata-driven invocation | Metadata-first model |
| `java.lang.invoke` | Typed executable handles, adaptation/composition, or runtime linkage | Runtime/JVM-oriented model |

Reflection example:

```java
Method method = Greeter.class.getMethod("greet", String.class);
Object result = method.invoke(greeter, "Phuong");
```

MethodHandle example:

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();
MethodType type = MethodType.methodType(String.class, String.class);
MethodHandle handle = lookup.findVirtual(Greeter.class, "greet", type);

String result = (String) handle.invokeExact(greeter, "Phuong");
```

MethodHandle does not replace Reflection. Reflection remains the owner of runtime inspection; this module compares the two only enough to explain why a framework may inspect with Reflection but execute through precomputed MethodHandles.
