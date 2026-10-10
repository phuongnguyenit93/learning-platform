`SymbolLookup.libraryLookup` loads, if necessary, a specific native library and creates a lookup tied to an `Arena`.

```java
try (Arena arena = Arena.ofConfined()) {
    SymbolLookup lookup =
        SymbolLookup.libraryLookup("native_math", arena);

    MemorySegment add = lookup.find("add").orElseThrow();
}
```

The arena is part of the lifetime contract. With a closeable arena, closing the arena ends the lifetime associated with the lookup and its symbol segments; the corresponding library can then be unloaded according to the API contract.

There are overloads accepting a library name or a `Path`. Library-name resolution remains operating-system specific.

In Java 21, `libraryLookup` is a restricted operation because loading arbitrary native code is inherently unsafe. Preview enablement and native-access warning control remain separate concerns.

Use a library-specific lookup when the integration depends on a known native dependency rather than on whichever symbols happen to be exposed by the linker's default lookup.
