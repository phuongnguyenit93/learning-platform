A `Linker` connects Java invocation to a foreign function ABI. For the current operating system and processor, `Linker.nativeLinker()` returns the linker that understands the platform's native calling conventions and supported native layouts.

The linker does not discover a function by itself. It needs:

- an address identifying the foreign entry point;
- a `FunctionDescriptor` describing its parameter and return layouts.

The usual flow is:

```text
find native symbol
      ↓
obtain symbol address
      ↓
describe function signature
      ↓
Linker creates downcall MethodHandle
      ↓
invoke using Java carriers derived from the descriptor
```

The reverse direction uses the same linker to build an upcall stub so native code can invoke a Java `MethodHandle` through a function pointer.

The linker therefore owns ABI adaptation at the Java/native call boundary. It does not replace the need to describe the native signature correctly.
