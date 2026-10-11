At the native boundary, every resource needs a clear **owner** and a clear release point. A resource is not only native memory; it can also be a JNI global reference, an upcall stub, a native-library association, a file mapping, or a handle returned by a C library.

A small ownership table often exposes lifecycle mistakes early:

| Resource | Created by | Released by | Lifetime |
| --- | --- | --- | --- |
| Allocation from a closeable Arena (`ofConfined` / `ofShared`) | Java binding | Arena.close | task/component scoped |
| Allocation from `Arena.ofAuto()` / `Arena.global()` | Java binding/runtime | not manually closed | GC-managed lifetime / process lifetime |
| JNI global reference | native code | DeleteGlobalRef | until the Java object no longer needs to be retained |
| upcall stub | Java binding | follows its associated Arena; `Arena.close()` only when that Arena is closeable | until the callback is unregistered and the Arena lifetime ends |
| native handle | native library | matching close/free API | defined by the library contract |

Not every Arena is closeable: `ofConfined` and `ofShared` support explicit close, while `ofAuto` and `global` are not released through `Arena.close()`. If the owner, release action, or lifetime cannot be stated precisely, the integration is not yet safe enough to rely on.
