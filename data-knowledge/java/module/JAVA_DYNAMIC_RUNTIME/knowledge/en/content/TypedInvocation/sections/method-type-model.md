`MethodType` is an immutable value object that describes the **return type plus parameter types** of an invocation. It contains no method name, receiver, or implementation.

```java
MethodType type =
        MethodType.methodType(
                String.class,
                String.class
        );
```

```text
(String)String
   │       └── return type
   └────────── parameter types
```

Every MethodHandle has a `type()`. The caller also contributes a symbolic method type at the call site. The JVM uses these contracts to determine whether invocation is exact or whether adaptation is required.

`MethodType` is also the Java-level representation of a JVM method descriptor. For example:

```text
(Ljava/lang/String;)Ljava/lang/String;
```

You do not need constant-pool details here; the important point is that MethodType is the shared call schema used by MethodHandle and invokedynamic.
