FFM uses `MethodHandle` as the Java invocation shape for downcalls and as the Java target shape for upcalls.

For a downcall:

```java
MethodHandle add = linker.downcallHandle(
    symbol,
    FunctionDescriptor.of(
        ValueLayout.JAVA_INT,
        ValueLayout.JAVA_INT,
        ValueLayout.JAVA_INT
    )
);

int result = (int) add.invokeExact(2, 3);
```

The handle's Java method type is derived from the descriptor's layouts and linker rules. That typed invocation bridge is why FFM naturally interacts with `java.lang.invoke`.

This module only needs the boundary:

```text
FFM owns
→ how a foreign signature becomes a callable/callback boundary

Dynamic Runtime owns
→ deep MethodHandle lookup, adaptation, composition, invocation mechanics
```

Do not duplicate the full `MethodHandle` curriculum here. The interoperability concern is that the handle type and the foreign descriptor must remain compatible.
