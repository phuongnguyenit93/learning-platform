JNI and FFM both solve Java-to-native interoperability, but they optimize for different integration models.

| Aspect | JNI | FFM |
| --- | --- | --- |
| Primary model | native methods + JNI function interface | foreign memory + foreign functions |
| Glue code | commonly requires C/C++ JNI glue | many bindings can be written directly in Java |
| Java object interaction | deep access through JNIEnv | not the primary model |
| C-style function APIs | possible, often with more boilerplate | maps naturally to SymbolLookup and Linker |
| Memory/resource lifetime | JNI has Java-object/reference semantics, but native allocations/resources need separate management and there is no Arena-like scoped-memory model | native-memory lifetime is modeled explicitly with MemorySegment and Arena |
| Java 21 baseline | long-established API | preview API under JEP 442 |

Neither mechanism is universally better. A stable existing JNI wrapper does not need to be rewritten simply because FFM is newer. Conversely, a new C API built around functions, pointers, and explicit layouts can often use FFM with much less handwritten native glue.
