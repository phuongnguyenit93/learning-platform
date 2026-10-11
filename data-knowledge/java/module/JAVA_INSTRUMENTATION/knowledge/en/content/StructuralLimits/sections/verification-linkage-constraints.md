Transformer output must pass several layers:

~~~text
well-formed class-file format
        ↓
supported class-file version
        ↓
verification
        ↓
name / hierarchy / structural constraints
        ↓
linkage
        ↓
definition installed
~~~

Failures can surface as:

- ClassFormatError;
- UnsupportedClassVersionError;
- NoClassDefFoundError when the class name does not match;
- ClassCircularityError;
- LinkageError;
- UnsupportedOperationException for unsupported structural change.

ClassFileTransformer runs **before** verification. Successfully generating a byte[] with a library does not mean the JVM will accept the definition.

Transformer testing should include negative cases, not only “ASM/Byte Buddy did not throw.”
