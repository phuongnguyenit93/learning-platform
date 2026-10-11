`JNIEnv` is the native thread's gateway to JVM services. It exposes the JNI function interface for operations such as finding classes, creating strings, reading fields, calling Java methods, managing references, and checking exceptions.

Native methods receive a `JNIEnv*` from the JVM:

```c
JNIEXPORT void JNICALL
Java_com_example_Bridge_run(JNIEnv* env, jobject self) {
    jclass cls = (*env)->FindClass(env, "java/lang/String");
    /* ... */
}
```

The crucial rule is that a `JNIEnv*` belongs to the current attached native thread. Do not cache one and use it from another thread. Native threads must obtain their own environment through the `JavaVM` attachment contract.

The environment also carries pending-exception state for the thread. After a JNI operation raises an exception, native code must follow the JNI rules for checking, clearing, replacing, or propagating it instead of continuing as if nothing happened.
