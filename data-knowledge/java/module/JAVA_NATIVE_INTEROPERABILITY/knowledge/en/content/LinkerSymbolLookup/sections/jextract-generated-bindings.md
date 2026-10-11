`jextract` is tooling that can read native C headers and generate Java bindings based on FFM concepts. Its purpose is to remove repetitive hand-written declarations for large native APIs.

Without generated bindings, application code may manually define:

- layouts for native declarations;
- symbol names;
- function descriptors;
- helper methods around downcall handles;
- constants and type aliases represented in the header.

Generated bindings can make a large API easier to consume and reduce transcription mistakes. They do not remove the underlying ABI, lifetime, or safety rules.

Treat `jextract` as **supporting tooling**, not as the core FFM abstraction:

```text
FFM API
→ conceptual/runtime contract

jextract
→ code generation that materializes bindings for a native header
```

When debugging generated code, you still need to understand `MemorySegment`, layouts, symbol lookup, descriptors, and linker calls. Tool/version details may evolve independently from the Java 21 API baseline.

With symbol resolution and function signatures established, the next chapter executes the boundary in both directions: downcalls from Java to native code and upcalls where native code invokes a Java callback.
