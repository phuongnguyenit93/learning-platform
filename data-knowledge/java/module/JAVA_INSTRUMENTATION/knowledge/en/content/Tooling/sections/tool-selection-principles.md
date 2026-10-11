There is no single bytecode tool that is best for every agent. Choose based on the problem:

~~~text
need low-level instruction/class-file control?
→ a low-level API such as ASM fits

need type/method matching plus advice?
→ a higher-level abstraction such as Byte Buddy often fits

target a newer JDK and can use the standard Class-File API?
→ consider java.lang.classfile on an appropriate baseline
~~~

Important criteria include:

- class-file version support;
- attribute preservation;
- stack-map/frame handling;
- API stability;
- dependency footprint;
- helper/auxiliary-class strategy;
- redefine/retransform integration;
- test/debug ergonomics.

The tool is an implementation choice. Agent lifecycle, targeting, capabilities, and structural limits still come from Instrumentation/JVM semantics.
