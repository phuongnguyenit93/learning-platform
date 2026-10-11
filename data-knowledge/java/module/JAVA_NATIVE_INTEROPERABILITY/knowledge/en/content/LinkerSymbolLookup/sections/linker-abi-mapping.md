The native linker knows the ABI of the platform on which the JVM is currently running. It uses that knowledge to translate the layouts in a function descriptor into the machine-level calling convention.

That adaptation can include details such as:

- which argument carriers go in registers or stack slots;
- how return values are represented;
- how pointer-sized values are passed;
- how supported struct/union layouts are classified by the ABI.

This is why a descriptor is expressed in memory layouts rather than only Java classes.

```text
Java carriers
      ↓
FunctionDescriptor layouts
      ↓
native Linker
      ↓
current OS/CPU ABI
      ↓
foreign function
```

`Linker.nativeLinker()` only represents the underlying native platform. It is not a cross-compiler that lets one JVM invoke a function using an unrelated target platform ABI.

Correct layout selection remains the application's responsibility.
