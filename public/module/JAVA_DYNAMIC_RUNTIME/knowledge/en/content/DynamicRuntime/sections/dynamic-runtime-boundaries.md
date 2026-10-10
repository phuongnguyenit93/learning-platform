Recommended prerequisites:

- Java types, methods, fields, constructors, and exceptions;
- Reflection at the `Class`, `Method`, and `Field` level;
- JVM concepts such as bytecode, method descriptors, and linkage;
- concurrency fundamentals before reasoning deeply about `MutableCallSite` visibility or VarHandle memory ordering.

This module **owns**:

- `MethodType`, `MethodHandle`, and signature polymorphism;
- `MethodHandles.Lookup` and access capabilities;
- MethodHandle adaptation and composition;
- `CallSite`, bootstrap linkage, and `invokedynamic`;
- `VarHandle` as a typed variable-access primitive.

It **hands off**:

- full metadata/member inspection → Reflection;
- constant-pool structure, bytecode execution, and JVM resolution rules → JVM;
- happens-before/JMM and lock-free algorithm design → Concurrency;
- JNI/FFM/native memory → Native Interoperability;
- release-by-release history → Java Version.

As you continue, keep asking: **which part of runtime behavior does this primitive own, and which part belongs to a neighboring module?**
