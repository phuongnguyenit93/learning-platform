The JNI Invocation API is used when a **native application hosts a JVM** or when native code needs the VM-level thread attachment interface. This reverses the common JNI direction: the native process can start the JVM and then call Java code.

Its main lifecycle looks like:

```text
prepare VM options
      ↓
JNI_CreateJavaVM
      ↓
JavaVM* + initial JNIEnv*
      ↓
GetEnv / attach / detach native threads
      ↓
DestroyJavaVM during orderly shutdown when appropriate
```

The Invocation API also provides current-process VM discovery through `JNI_GetCreatedJavaVMs`.

The central distinction is between a VM-wide handle and a thread-local environment. `JavaVM*` represents the invocation interface for the JVM; `JNIEnv*` represents JNI access for one attached thread.
