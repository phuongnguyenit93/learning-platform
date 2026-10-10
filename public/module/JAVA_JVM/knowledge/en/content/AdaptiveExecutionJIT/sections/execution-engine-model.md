The JVM specification does not require bytecode to be executed by one fixed technique. A compliant implementation may interpret, compile, or combine several execution modes as long as Java-level semantics are preserved.

HotSpot commonly uses an **adaptive execution** model:

```text
bytecode
   ↓
interpreter starts execution
   ↓
runtime profiling observes behavior
   ↓
hot code is compiled
   ↓
optimized native code
```

This avoids compiling every path eagerly while still allowing the runtime to spend optimization effort on code that actually matters to the workload.

Think of the execution engine as the subsystem that turns JVM instruction semantics into machine execution, not as an application-facing API.
