A native library is a binary artifact loaded into the current process so code in that process can call exported machine-code entry points. The exact file format depends on the platform: for example, Windows commonly uses DLLs, Linux uses ELF shared objects, and macOS uses Mach-O dynamic libraries.

Java does not call a library “by file contents.” The important runtime sequence is:

```text
native library file
      ↓ load into process
exported symbols become available
      ↓ resolve a symbol
native address / entry point
      ↓ call using the correct ABI
native function executes
```

JNI often loads a library that contains implementations of Java `native` methods. FFM can also work with loaded libraries, but resolves symbols through `SymbolLookup` and creates call handles through `Linker`.

The library is only one part of the contract. A successful load does not prove that the expected symbol exists or that Java is using the correct function signature. Those are separate linkage and ABI concerns.
