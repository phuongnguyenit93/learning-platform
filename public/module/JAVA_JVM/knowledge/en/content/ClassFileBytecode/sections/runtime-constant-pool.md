When the JVM creates a class or interface at runtime, information from its class-file constant pool is used to construct a **runtime constant pool**. This runtime structure serves many of the same purposes as a symbol table in a traditional language implementation.

It can contain:

- static constants ready for use;
- symbolic references that may still require resolution;
- runtime representations used by instruction execution.

The runtime constant pool is therefore a **runtime data structure**, not simply the original bytes sitting in the class file.

Resolution timing is flexible within the specification rules, so you should not assume every symbolic reference is resolved immediately when a class is first loaded.
