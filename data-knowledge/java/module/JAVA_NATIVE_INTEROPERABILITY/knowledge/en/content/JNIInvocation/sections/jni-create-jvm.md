`JNI_CreateJavaVM` creates a JVM inside the current native process. On success it returns:

- a `JavaVM*` for VM-level operations;
- a `JNIEnv*` for the thread that created the JVM.

```c
JavaVM* vm;
JNIEnv* env;

jint rc = JNI_CreateJavaVM(
    &vm,
    (void**)&env,
    &args
);
if (rc != JNI_OK) {
    /* startup failed */
}
```

The Invocation API does **not support creating multiple JVMs in one process**. Design the host around one JVM instance per process rather than treating `JNI_CreateJavaVM` as a factory for independent VMs.

The creating thread can then use `env` to find classes, call Java methods, and create/manage Java objects under the normal JNI rules.

Creating the JVM is only the beginning. The native host still owns bootstrap errors, Java exception handling, thread attachment policy, native resource lifetime, and shutdown coordination.
