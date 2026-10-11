Annotation processors participate in every consumer's build, so small design mistakes can make compilation fragile or non-reproducible.

### PITFALL — non-deterministic output

Avoid output that depends on unstable iteration order, timestamps, random values, machine-specific paths, or network responses unless the build contract explicitly requires them.

```text
same source + same processor inputs
→ should normally produce the same generated artifacts
```

Sort elements when output order matters and keep external side effects outside ordinary processing logic.

### PITFALL — assuming one round

Generated sources can create new rounds. Track what has already been generated and do not recreate the same file on each call to `process(...)`.

The final round (`processingOver() == true`) is appropriate for final diagnostics or cleanup. Do not generate a new type there if the design expects another normal processing round to consume that type.

### PITFALL — source-name collisions

Before choosing generated type names, define a stable ownership/naming scheme. Two processors or two annotated elements attempting to create the same source file will conflict.

### PITFALL — treating compiler internals as portable API

`javax.annotation.processing` and `javax.lang.model` are the standard contracts. Depending on compiler-specific AST internals can tie a processor to one compiler implementation or release and should be a deliberate choice rather than an accidental dependency.

### PITFALL — hiding actionable validation errors

When metadata is invalid, report a precise diagnostic on the relevant element. A generated file that fails later with an unrelated compiler error gives the user a much worse feedback loop.

### TRADE-OFF — generated code reduces runtime work but adds build complexity

Compile-time generation can move discovery and validation earlier, improve type safety, and avoid some runtime scanning. It also introduces processor configuration, generated-source debugging, build-cache/incremental-build concerns, and another compatibility surface.

Use annotation processing when compile-time validation or generation materially improves the design. For runtime-only metadata decisions, a processor may add complexity without removing a real problem.

The next chapter uses this lifecycle knowledge to make the design decision explicit: **when are annotations the clearest choice, and when is an API, interface, or configuration easier to understand?**
