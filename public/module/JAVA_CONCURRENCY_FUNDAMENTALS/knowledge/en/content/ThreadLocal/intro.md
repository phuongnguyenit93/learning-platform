# ThreadLocal & Context Propagation

`ThreadLocal<T>` provides a way to attach a value to **Current Thread**.

Mental models should be used:

```text
Thread
→ have ThreadLocal-associated storage
→ ThreadLocal key used to access the corresponding value of that Thread
```

It is not recommended to:

```text
ThreadLocal = copy a shared variable for each Thread
```

and it is not:

```text
ThreadLocal = shared state visibility resolution tool
```

ThreadLocal Normal **Avoid sharing** a type of context, instead of synchronizing access to the same state.
