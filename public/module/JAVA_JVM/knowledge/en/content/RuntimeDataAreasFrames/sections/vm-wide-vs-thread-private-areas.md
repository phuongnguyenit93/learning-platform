Some runtime areas exist for the VM as a whole while others belong to individual threads.

```text
VM-wide/shared
├─ Heap
├─ Method Area
└─ Runtime Constant Pools (associated with classes/interfaces)

Per-thread
├─ pc Register
├─ JVM Stack
└─ Native Method Stack (when an implementation uses one)
```

This ownership distinction helps explain lifetime and visibility of runtime state. A local variable belongs to a frame on one thread's JVM stack, while an object referenced by that local variable normally lives on the shared heap.

This is not the Java Memory Model. Shared-vs-thread-private here is a **runtime storage model**; happens-before and inter-thread visibility belong to Concurrency.
