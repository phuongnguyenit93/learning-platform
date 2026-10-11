`JavaVM::GetEnv` checks the current thread's attachment state for a requested JNI version. It can return a valid `JNIEnv*` when the thread is attached, `JNI_EDETACHED` when it is not, or `JNI_EVERSION` for an unsupported version.

```text
GetEnv
  ├─ JNI_OK        → use returned JNIEnv*
  ├─ JNI_EDETACHED → AttachCurrentThread / AttachCurrentThreadAsDaemon
  └─ JNI_EVERSION  → fix requested JNI version
```

`AttachCurrentThread` attaches the current native thread as a normal Java-attached thread. `AttachCurrentThreadAsDaemon` gives it daemon semantics for JVM termination. `DetachCurrentThread` removes the association before the native thread exits; the thread cannot detach while Java methods are still present on its call stack.

Align attachment with the real worker-thread lifecycle. A long-lived native worker should not attach and detach around every tiny JNI call, while a short-lived thread should not terminate while still attached.
