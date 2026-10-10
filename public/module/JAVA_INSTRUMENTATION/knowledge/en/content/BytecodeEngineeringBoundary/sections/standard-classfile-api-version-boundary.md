The Java platform now has a standard Class-File API in java.lang.classfile. Its evolution is:

~~~text
Java 22 → Preview
Java 23 → Second Preview
Java 24 → Standard API
~~~

It provides a model for parsing, generating, and transforming class files and can be an important tooling option for agents on suitable JDKs.

This Instrumentation module does not own the full java.lang.classfile curriculum because:

- Instrumentation is the runtime agent/lifecycle contract;
- Class-File API is a separate platform API for class-file processing;
- a JDK 21 learner still needs ASM, Byte Buddy, or another compatible tool;
- version-specific API evolution belongs to Java Version.

The connection is simply:

~~~text
ClassFileTransformer
→ needs new byte[]
→ Class-File API / ASM / Byte Buddy can produce those bytes
~~~
