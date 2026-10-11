Thread leaks occur when threads are created without a proper termination/lifecycle strategy and continue to live longer than the owner wants.

Dangerous examples:

```java
new Thread(() -> {
    while (true) {
        doSomething();
    }
}).start();
```

If there is no cancellation path and the owner no longer controls the reference/lifecycle.

Living Thread can hold:

- native thread resources;
- stack;
- object reachable from stack/thread-local;
- classloader/context reference;
- CPU if loop works.

### Demo bounded

References:

```text
LeakController#threadLeakPattern()
GET /leak/thread-pattern
```

Workers are deliberately held in a standby state to observe:

```text
aliveBeforeCleanup = true
```

Then Experiment Release Worker and join:

```text
aliveAfterCleanup = false
```

**Final Thoughts** The demo shows a leaked pattern without actually leaving a leaked thread.
