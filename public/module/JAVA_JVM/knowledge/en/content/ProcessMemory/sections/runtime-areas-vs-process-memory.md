JVMS runtime data areas are abstractions that define execution semantics. Process-level memory is how a concrete implementation obtains native/virtual memory from the operating system to implement those abstractions and other runtime subsystems.

There is no required one-to-one mapping:

```text
spec concept       implementation examples
-----------        -----------------------
heap               heap reservation/commit
method area        class metadata structures
JVM stacks         native thread-stack mappings
execution engine   code cache/compiler data
```

A JVM implementation may reorganize these internals across releases and still conform to the same specification.

Do not force every byte reported by the OS into exactly one JVMS runtime area.
