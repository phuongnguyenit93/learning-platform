Not every runtime failure happens “inside the method body.” Class-file format checks, verification, linking, or initialization can fail before the intended bytecode begins executing.

Useful failure categories include:

- invalid or unsupported class representation/version;
- verification failure;
- missing or incompatible classes/members during linkage;
- failure while executing static initialization.

A practical example is compiling against one dependency version and running with another. The method call may fail during linkage because a symbolic reference no longer matches the runtime type, before the target method body executes.

Keep this distinction:

```text
successful compilation
≠ guaranteed successful runtime linkage
```

Determining exactly where a class came from belongs to Class Loading/Diagnostics; here the goal is identifying the pre-execution failure boundary.
