`MethodHandle.invokeExact` and `invoke` appear in Java source as if they were ordinary methods, but the JVM treats them specially as **signature-polymorphic methods**. The actual descriptor comes from the static types present at the call site.

```java
MethodHandle handle = ...; // (Greeter,String)String

String value =
        (String) handle.invokeExact(
                greeter,
                "Phuong"
        );
```

The `(String)` cast is not merely “casting an Object result.” It helps establish the expected return type of the call-site descriptor.

This matters during debugging: two source lines that look nearly identical can produce different call-site descriptors because an argument or expected return type has a different static type.
