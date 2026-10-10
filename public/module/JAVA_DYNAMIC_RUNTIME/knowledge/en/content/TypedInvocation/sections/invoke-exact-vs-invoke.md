`invokeExact` requires the call-site symbolic type to **exactly match** the MethodHandle type.

```java
MethodHandle h = ...; // (Greeter,String)String

String ok = (String) h.invokeExact(greeter, "A");
```

`invoke` is more flexible: it can apply conversions comparable to `asType` when the conversion is supported.

```java
Object value = h.invoke(greeter, "A");
```

Practical rule:

- prefer `invokeExact` once a pipeline has a normalized exact contract;
- use `invoke` when conversions permitted by `MethodHandle.asType` are intentionally acceptable;
- do not use `invoke` to hide an unclear type design.

Framework code often becomes easier to reason about when handles are normalized to one canonical `MethodType` before exact invocation.
