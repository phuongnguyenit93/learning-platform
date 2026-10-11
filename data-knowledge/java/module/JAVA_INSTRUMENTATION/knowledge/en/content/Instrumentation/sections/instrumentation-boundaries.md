Before going deeper, the learner should already have these mental models:

- **JVM / bytecode:** a class file is verified, linked, and executed by the JVM.
- **ClassLoader:** class identity includes both binary name and defining loader; transformers receive loader context.
- **basic JPMS:** readability, exports, and opens are needed to understand redefineModule.
- **basic concurrency:** classes can load on multiple threads, so transformers must tolerate races and reentrancy.

This module owns Java agents, Instrumentation, ClassFileTransformer, redefine/retransform, and the direct operational boundary of agents.

The following topics are handed off:

~~~text
class-file format / JVM execution internals
→ JVM

deep class-loading delegation / identity
→ Java Core ClassLoader

deep JPMS semantics
→ Java 9 Module System

evidence interpretation / troubleshooting
→ Runtime Diagnostics

JVMTI / native-agent internals
→ native/JVM tooling boundary
~~~

That boundary gives enough context to design and evaluate agents without turning this module into a second JVM, ClassLoader, JPMS, or ASM course.
