Native binaries are normally platform artifacts. Compatibility depends on more than the library's logical name.

At minimum, check:

- operating-system family and binary format;
- CPU architecture such as x86-64 versus AArch64;
- ABI/calling convention;
- transitive native dependencies;
- vendor/runtime assumptions made by the library;
- exported symbol set and version.

A 64-bit x86 Windows DLL cannot be loaded into an AArch64 Linux process just because both expose a function named `add`. The machine code, object format, loader, and ABI are different.

This is why native integrations often need platform-specific packaging:

```text
native/
  windows-x86_64/...
  linux-x86_64/...
  linux-aarch64/...
  macos-aarch64/...
```

Java bytecode may be portable across those environments, while the native payload is not. Treat the native artifact matrix as part of the application's deployment contract and test it explicitly in the environments you claim to support.

With the library, symbol, and ABI contract established, the next chapter can focus on JNI: the traditional JVM bridge that applies those native contracts to Java methods, references, exceptions, and threads.
