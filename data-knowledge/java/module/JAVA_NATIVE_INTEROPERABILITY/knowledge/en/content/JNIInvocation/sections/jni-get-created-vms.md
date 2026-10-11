`JNI_GetCreatedJavaVMs` reports JVMs that were created in the **current process**. It is useful when native code is running in a process that may already host a JVM and needs a `JavaVM*` rather than creating another VM.

```c
JavaVM* vms[1];
jsize count = 0;

jint rc = JNI_GetCreatedJavaVMs(vms, 1, &count);
if (rc == JNI_OK && count > 0) {
    JavaVM* vm = vms[0];
}
```

This is not a machine-wide JVM discovery API. It does not list other Java processes.

Finding the `JavaVM*` also does not mean the current native thread is attached. The next step is to call `GetEnv` and attach the thread when necessary.
