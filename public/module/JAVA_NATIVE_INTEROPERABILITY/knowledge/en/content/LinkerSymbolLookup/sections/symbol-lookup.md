A `SymbolLookup` resolves a native symbol name to an address represented as a zero-length native `MemorySegment`.

```java
Linker linker = Linker.nativeLinker();

MemorySegment strlen = linker.defaultLookup()
    .find("strlen")
    .orElseThrow();
```

The lookup answers **where is the symbol?** It does not tell Java the function's argument or return types. That second part belongs to `FunctionDescriptor`.

The zero-length symbol segment can be supplied to `Linker.downcallHandle(...)` as the target address.

Different lookup sources have different visibility:

- `linker.defaultLookup()` searches symbols in the implementation-defined set of commonly used native libraries for that linker;
- `SymbolLookup.loaderLookup()` searches libraries associated with the caller's class loader;
- `SymbolLookup.libraryLookup(...)` creates a lookup for a specific library.

Do not assume a symbol exposed by one platform's default lookup is portable to every supported platform.
