ASM is a low-level bytecode library commonly used to read and write class files through visitor/tree-style APIs. It fits Instrumentation when:

- precise method/instruction control is required;
- transformations are small but performance-sensitive;
- the team already has JVM/bytecode expertise;
- avoiding hidden auxiliary machinery is important.

Mental model:

~~~text
classfileBuffer
→ ClassReader
→ visitor/tree transformation
→ ClassWriter
→ byte[]
~~~

The cost is more responsibility:

- select the correct API/class-file version;
- handle frames/max stack correctly;
- preserve valid control flow;
- retain important attributes;
- test across JDK/compiler outputs.

This module teaches ASM only far enough to understand its supporting implementation role, not the complete library API.
