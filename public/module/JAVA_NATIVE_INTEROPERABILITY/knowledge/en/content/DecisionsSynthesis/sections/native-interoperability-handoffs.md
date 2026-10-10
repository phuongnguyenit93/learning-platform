This module stops at the **Java-to-native boundary** and deliberately hands deeper topics to the modules that own them.

- **JVM** owns runtime internals, JVM native-memory internals, and the execution engine.
- **Dynamic Runtime** owns deep MethodHandle/VarHandle mechanics, adaptation, and typed invocation.
- **Java Version / Java 22 FFM** owns release-by-release FFM evolution and the finalization milestone.
- **Outside the Java curriculum** are the C/C++ language, compiler/linker toolchains, and platform-specific ABI engineering in depth.
- **Infrastructure/runtime** owns general OS and process administration.

Here, the learner only needs enough of those neighboring concepts to design a correct native integration. For example, Linker returns MethodHandle, but this module does not reteach the full MethodHandle combinator model; Java 22 finalizes FFM, but the working baseline here remains Java 21 preview.

The final checkpoint is being able to explain the complete path: choose and load a native library, define the data and function contracts, manage memory and callback lifetimes, invoke through JNI or FFM, and propagate errors while releasing resources safely.
