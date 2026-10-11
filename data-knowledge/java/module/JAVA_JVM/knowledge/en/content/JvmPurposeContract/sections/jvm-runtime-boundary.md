This JVM module owns the mental model of how class-file code becomes runtime state and executes: runtime data areas, frames, the managed heap, garbage-collection concepts, interpretation/JIT compilation, native-memory awareness, and VM ergonomics.

Several neighboring topics touch the JVM but have different owners:

- **Class Loading** owns ClassLoader APIs, delegation, and class-loader identity in depth.
- **Concurrency** owns happens-before, the Java Memory Model, and correctness between threads.
- **Dynamic Runtime** owns the MethodHandle/CallSite/VarHandle programming model.
- **Instrumentation** owns Java agents and class transformation.
- **Native Interoperability** owns JNI, FFM, and native-call/memory programming.
- **Runtime Diagnostics** owns JFR, NMT, dumps, logs, and evidence-driven troubleshooting.

Keeping these boundaries clear lets this module explain the **runtime mechanism** while downstream modules explain how to extend, control, or diagnose it.

The module follows one continuous learning path:

```text
JVM + class-file contract
→ class files / bytecode / pre-execution lifecycle
→ runtime data areas + frames
→ managed heap + garbage collection
→ interpreter + JIT + adaptive optimization
→ whole-process memory
→ HotSpot ergonomics / VM controls
→ end-to-end JVM mental model
```

Each later chapter expands one part of that execution model rather than introducing an unrelated catalog of runtime terms.
