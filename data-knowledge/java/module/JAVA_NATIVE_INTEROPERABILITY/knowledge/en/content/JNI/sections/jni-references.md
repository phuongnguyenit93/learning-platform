JNI references connect native code to Java objects while still allowing the JVM to manage those objects.

**Local references** are thread-local references associated with a JNI local frame. During a Java → native method call, the JVM releases that call's local references when the native method returns. A native thread attached through the Invocation API has no such native-method return boundary for arbitrary JNI work, so its local references can remain until they are deleted, their local frame is popped, or the thread detaches. Long-lived attached threads must therefore clean up local references explicitly.

**Global references** remain valid independently of a particular local frame or attached-thread lifetime and can be retained by native state. They are created with `NewGlobalRef` and must be released with `DeleteGlobalRef`.

**Weak global references** do not keep the referent alive. A simple check followed by later use is racy because the referent can be collected between those operations. Before dereferencing a weak global, promote it to a strong local/global reference—for example with `NewLocalRef`—and test the promoted reference for `NULL`. A successful promotion keeps the object alive for the lifetime of that strong reference.

Reference kind therefore expresses lifetime:

```text
temporary work inside one JNI frame → local reference
must outlive the local frame/thread → global reference
must not keep object alive          → weak global reference
```

Leaking a global reference can keep a Java object reachable indefinitely. Persisting a local reference beyond its valid frame can leave native code holding an invalid handle; conversely, attached native threads should not assume locals are auto-freed between arbitrary JNI calls.
