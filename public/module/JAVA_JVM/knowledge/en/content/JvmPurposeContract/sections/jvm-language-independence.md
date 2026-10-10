The JVM is not a machine that understands only Java source code. It understands the structures expressible through the class-file format and JVM instruction set. The Java compiler is one class-file producer; other JVM languages can target the same runtime.

That common substrate makes it possible for languages to:

- reuse Java libraries;
- interoperate when their JVM-level types and conventions are compatible;
- share the same garbage collector, JIT compiler, profiler, and diagnostic tooling;
- run inside the same process/runtime.

Sharing a JVM does **not** mean every language feature maps one-to-one to a Java feature. A compiler may encode its semantics using synthetic methods, `invokedynamic`, metadata, or a language-specific runtime library.

This module focuses on the common execution substrate, not the language semantics of every JVM language.
