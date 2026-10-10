JNI, the Java Native Interface, is the long-standing standard interface between the JVM and native code. It lets Java declare methods whose implementations live in native libraries and lets native code call back into JVM services through a defined function interface.

A typical Java-to-native flow is:

```text
Java calls a native method
        ↓
JVM resolves the native implementation
        ↓
native function receives JNIEnv* + Java arguments
        ↓
native code uses JNI functions when it must interact with Java objects
        ↓
result or pending Java exception crosses back
```

JNI exists because native code must not treat JVM-managed objects as ordinary C memory. Objects may move, be collected, and obey VM rules that raw native pointers do not understand.

The important mental model is that JNI is a **bridge contract**. It defines how values, references, threads, methods, fields, and exceptions cross the Java/native boundary while keeping the JVM involved in managed-object operations.
