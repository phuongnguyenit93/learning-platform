After this module, you should be able to explain these questions without relying on a memorized list of VM flags:

1. What execution contract does the JVM consume, and what role does the class file play?
2. How are loading/linking/initialization different from method execution?
3. How do the heap, method area, JVM stack, frames, and runtime constant pool relate?
4. Why does a source-level `new` not guarantee a physical heap object that survives until GC?
5. Why is there no single mandatory “Java GC algorithm”?
6. How do interpretation, profiling, JIT compilation, and deoptimization form adaptive execution?
7. Why can RSS grow while heap usage stays stable?
8. Which VM controls are HotSpot details rather than Java/JVM contract?
9. When should reasoning stop and diagnostics begin?

If you can answer those as a connected flow rather than isolated definitions, your JVM mental model is ready for the later Java Advanced modules.
