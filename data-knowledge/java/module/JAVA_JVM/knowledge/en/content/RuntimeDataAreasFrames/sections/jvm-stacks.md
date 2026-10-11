Each JVM thread has its own JVM stack. The stack primarily contains **frames** for the thread's active method invocations.

```text
Thread A JVM Stack
┌─────────────────┐
│ methodC frame   │ ← current
├─────────────────┤
│ methodB frame   │
├─────────────────┤
│ methodA frame   │
└─────────────────┘
```

A new frame is created when a method is invoked and destroyed when that invocation completes. Because the stack is thread-private, a local reference is not automatically shared state even when the object it points to is on the shared heap.

Stack size may be fixed or dynamically expanded depending on the implementation. The specification defines semantics and failure boundaries rather than one physical layout.
