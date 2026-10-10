When a Java thread enters a native method, that thread is already attached to the JVM and receives a valid `JNIEnv*`.

A thread created independently by native code must attach before using JNI:

```text
native thread starts
      ↓
AttachCurrentThread or AttachCurrentThreadAsDaemon
      ↓
obtain this thread's JNIEnv*
      ↓
perform JNI work
      ↓
DetachCurrentThread before the native thread exits
```

The process-wide `JavaVM*` is the handle used for attachment and environment lookup. The `JNIEnv*` returned for one thread must not be reused by another.

Attachment is also a lifecycle concern. Native thread pools may live much longer than a single Java call, and daemon versus non-daemon attachment affects how those threads participate in JVM shutdown.

Design the native thread lifecycle first, then align attach/detach operations with it.

That thread boundary leads directly to the JNI Invocation API: the next chapter reverses the usual direction and asks how a native application hosts a JVM and manages VM-wide startup, attachment, and shutdown.
