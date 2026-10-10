The constant pool is a central table in the class file. In addition to literal constants, it stores symbolic information for classes, fields, methods, name-and-type pairs, method handles, dynamic call sites, and other entities.

JVM instructions do not need to embed a final machine address for a method or field:

```text
invokevirtual #12
              ↓
CONSTANT_Methodref
              ↓
class + name + descriptor
```

This symbolic representation means the class file does not need to know physical object layout or the final machine-code address at compile time. Runtime linking/resolution connects symbolic identities to runtime entities.

That makes the constant pool a key bridge between the binary class-file representation and runtime execution.
