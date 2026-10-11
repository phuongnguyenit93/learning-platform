A class file begins as a binary representation containing version information, the constant pool, fields, methods, and attributes.

When the runtime needs the type:

```text
class-file representation
→ load/create runtime class
→ verify + prepare (+ resolve as needed)
→ runtime constant pool / class metadata
→ initialize static state when triggered
```

Instruction execution can then operate against runtime entities rather than only symbolic entries in a file.

This is the bridge between the class-file chapter and runtime-data chapters: data “in the binary” becomes runtime structures used by execution.
