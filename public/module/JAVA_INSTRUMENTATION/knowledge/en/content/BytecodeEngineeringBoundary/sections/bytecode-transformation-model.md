Inside an agent, bytecode transformation can be modeled as:

~~~text
current class-file bytes
        +
transformation policy
        ↓
new class-file bytes
~~~

Instrumentation does not require an agent to parse constant pools or opcodes manually. It only requires a transformer to return valid bytes. The bytecode-engineering layer is responsible for:

- parsing input;
- locating methods/instructions of interest;
- inserting/removing/replacing code according to policy;
- updating metadata/stack maps where required;
- emitting a new class file.

For a timing probe:

~~~text
method entry
→ record start

all normal/exceptional exits
→ record duration
~~~

The hard part is not a few individual opcodes; it is preserving control flow, stack/local state, and class-file invariants.
