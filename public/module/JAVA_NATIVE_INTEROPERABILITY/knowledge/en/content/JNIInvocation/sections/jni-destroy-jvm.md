`DestroyJavaVM` requests orderly JVM termination in an embedding scenario. It is not a force-kill operation.

Shutdown depends on live non-daemon activity. A host cannot assume the VM will instantly vanish while Java or attached non-daemon work is still keeping it alive.

A practical shutdown design is:

```text
stop accepting new native/Java work
      ↓
finish application tasks
      ↓
release application-owned native/JNI resources
      ↓
detach native workers as appropriate
      ↓
request DestroyJavaVM
```

Do not use VM destruction as a substitute for correct per-resource cleanup. Global JNI references, native allocations, and thread ownership should already have defined lifetimes.

Some hosts intentionally keep the JVM alive until process exit. In those designs, process lifetime is the final boundary and `DestroyJavaVM` may not be part of the normal path.
