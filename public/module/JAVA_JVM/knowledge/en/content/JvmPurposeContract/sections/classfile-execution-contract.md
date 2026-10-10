The JVM Specification defines the **class-file format** as the binary contract a compliant JVM implementation understands. A class file carries version information, a constant pool, access flags, fields, methods, and attributes. Executable methods normally carry a `Code` attribute containing bytecode plus execution metadata.

The runtime does not need the original source language. If a toolchain produces a valid class-file representation, the JVM can process it according to the same contract.

The class file also does not prescribe the physical address of an object, the exact object-header layout, or a garbage-collection algorithm. It defines logical program structure and symbolic references; a runtime implementation decides how those concepts are represented and optimized on a real machine.

When reasoning about JVM behavior, first ask:

```text
Is this guaranteed by the class-file/JVM contract?
Or is it behavior of one concrete JVM implementation?
```
