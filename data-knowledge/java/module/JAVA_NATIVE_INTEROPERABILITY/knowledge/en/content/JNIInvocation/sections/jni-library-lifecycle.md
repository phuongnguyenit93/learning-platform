`JNI_OnLoad` and `JNI_OnUnload` are optional hooks associated with a JNI native library's lifecycle.

`JNI_OnLoad` runs when the JVM loads the library. It can initialize library state, cache the `JavaVM*`, register native methods, and return the JNI interface version the library expects:

```c
JNIEXPORT jint JNICALL
JNI_OnLoad(JavaVM* vm, void* reserved) {
    /* initialize library state */
    return JNI_VERSION_1_8;
}
```

If the library returns an unsupported version, loading fails.

`JNI_OnUnload` gives the library an opportunity to release library-wide resources when the JVM unloads it as part of the native-library/class-loader lifecycle. The JNI specification warns that this callback runs in an unknown context, so cleanup should be conservative: avoid arbitrary Java callbacks or assumptions about thread/class-loader state.

These callbacks are broad lifecycle hooks. Per-request, per-object, per-buffer, or per-callback resources should still be released according to their own ownership rules rather than waiting for library unload.
