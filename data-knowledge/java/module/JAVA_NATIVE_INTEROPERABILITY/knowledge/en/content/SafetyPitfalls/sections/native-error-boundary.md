Java and native libraries often use different error models. Java uses exceptions; a C API may return a negative status, NULL, errno, or a library-specific error object.

The binding layer should translate that boundary deliberately:

~~~text
native return/status
        ↓ inspect result according to the library contract
Java exception/result with context
        ↓
application handles the Java contract
~~~

With JNI, a Java exception raised during a native call becomes a pending exception and must be propagated, inspected, or cleared intentionally. With an FFM downcall, a native error code does not automatically become a Java exception; the binding must inspect the result according to the library contract.

Call state such as `errno` needs a stricter treatment. In Java 21, where the current platform exposes that state through the linker, use `Linker.Option.captureCallState("errno")` (or another supported captured-state name). The downcall then captures the state immediately after the foreign call into a caller-provided segment, before later Java/runtime activity can overwrite the conventional thread-local native error state. Supported captured-state names and their layout are platform-dependent and can be inspected through `Linker.Option.captureStateLayout()`.

Avoid exposing two competing error channels for the same operation unless callers have a clear rule for which one is authoritative.
