Two threads can reach the first active use at nearly the same time. The JVM therefore coordinates class initialization using a lock associated with the runtime class initialization process.

Conceptually:

```text
Thread A                         Thread B
   │                               │
first active use                first active use
   │                               │
owns initialization               └─ waits
   │
runs static initialization
   │
completes successfully
   │                               │
   └───────────────────────────────┴─ both continue with initialized class
```

This is why application code does not need to add its own lock merely to guarantee that a class's static initializer executes once.

Recursive requests from the thread already performing initialization are handled by the JVM initialization algorithm rather than starting a second initialization. Other threads wait until the first initialization either succeeds or fails.

The coordination also creates a design warning: static initialization should avoid large dependency graphs, blocking I/O, or lock cycles. Two classes whose initializers wait on each other through different threads can contribute to initialization deadlocks that are difficult to diagnose.

Prefer simple deterministic static setup. If startup requires external services, retries, cancellation, or explicit shutdown, an application lifecycle component is often a clearer place than a static initializer.
