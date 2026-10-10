`InheritableThreadLocal` allows the child Thread to receive the initial value from the parent at the time the child Thread is created.

References:

```text
ThreadLocalController#inheritance()
GET /context/inheritance
```

Deliberate Demo:

```text
parent = A
new Thread(...)
parent = B
child.start()
```

Child still observes the initial inherited value A.

**Final Thoughts** Inheritance associated with **Thread creation**, not "every time you submit a task, copy a new context".
