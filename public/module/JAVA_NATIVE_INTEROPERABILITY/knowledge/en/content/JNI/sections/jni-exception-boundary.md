Java exceptions and native error reporting are different mechanisms. JNI exposes operations such as `ExceptionCheck`, `ExceptionOccurred`, `ExceptionDescribe`, `ExceptionClear`, `Throw`, and `ThrowNew` so native code can participate in Java exception semantics deliberately. `ExceptionDescribe` is diagnostic but has an important side effect: it describes and then clears the pending exception.

When a JNI operation raises a Java exception, it becomes **pending** on the current thread. Native code should usually stop ordinary JNI work and return so that the exception can propagate, unless it has a deliberate recovery or translation path.

```c
jclass cls = (*env)->FindClass(env, "com/example/Missing");
if ((*env)->ExceptionCheck(env)) {
    return; // propagate the pending Java exception
}
```

Native libraries may instead report failures with status codes, `errno`-style values, output parameters, or library-specific error objects. The integration layer must define how recoverable native failures become Java results or exceptions.

A native segmentation fault is different again: it is not a Java exception and may crash the entire JVM process. JNI can translate error protocols, but it cannot make arbitrary native memory faults recoverable.
