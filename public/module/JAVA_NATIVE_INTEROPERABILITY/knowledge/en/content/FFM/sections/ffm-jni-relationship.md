JNI and FFM both cross the Java/native boundary, but they expose different programming models.

JNI centers the bridge on the JVM's native interface. Java declares `native` methods, while native code receives `JNIEnv*` and uses JNI operations to work with Java objects, methods, fields, references, threads, and exceptions.

FFM centers the bridge on **native contracts visible from Java**. Java code can describe memory layouts, allocate native memory, locate exported symbols, describe function signatures, and obtain call handles without writing a JNI wrapper for every ordinary C function.

| Need | JNI | FFM |
| --- | --- | --- |
| existing JNI library / native method contract | natural fit | usually not a direct replacement |
| manipulate Java objects deeply from native code | JNI function interface | not FFM's main model |
| call C-style exported functions from Java | usually JNI wrapper code | direct Linker/SymbolLookup model |
| native memory/data layout | manual native/JNI discipline | first-class MemorySegment/Layout/Arena model |
| embed a JVM in a native host | JNI Invocation API | outside FFM's purpose |

Do not reduce the choice to “old versus new.” Existing API shape, callback needs, Java-object interaction, deployment constraints, and JDK baseline all matter.
