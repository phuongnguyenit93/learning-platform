Virtual threads are not required to go through `ExecutorService`. Java 2. has two direct APIs worth knowing:

```java
Thread.startVirtualThread(task);

Thread.ofVirtual()
        .name("worker")
        .start(task);
```

Builder is useful when you need to configure the name/uncaught-exception handler before starting.

References:

```text
VirtualThreadController#creationApi()
GET /virtual-thread/creation-api
```

Experiment creates a Thread using each API and confirms:

```text
startVirtualThreadIsVirtual = true
builderIsVirtual = true
bothTerminated = true
```

**Final Thoughts** `newVirtualThreadPerTaskExecutor()` is a convenient abstraction for task submission/lifecycle; the virtual thread itself is still a `Thread` and can be created directly.
