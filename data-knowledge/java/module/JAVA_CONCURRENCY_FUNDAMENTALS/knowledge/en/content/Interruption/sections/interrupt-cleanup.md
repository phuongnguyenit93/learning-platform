Cancellation doesn't just mean exiting the loop.

Tasks may hold:

- file;
- socket;
- temporary resource;
- transaction/resource scope;
- state to be reset.

So a safe lifecycle usually takes the form of:

```java
try {
    while (! Thread.currentThread().isInterrupted()) {
        work
    }
} finally {
    Cleanup
}
```

Or with blocking operation:

```java
try {
    doBlockingWork();
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
} finally {
    cleanup();
}
```

`finally` It's important because cleanup shouldn't depend on workers ending up on the "happy path" or cancellation path.

### Demo in module

References:

```text
InterruptionController#cancelWithCleanup()
```

Endpoint:

```text
GET /interruption/cleanup
```

The experiment simulates a resource that is opened before the worker starts working.

After Sending `interrupt()`, observe:

```text
interruptionObserved = true
cleanupCall=true
resourceOpen = false
workerAlive = false
```

Workers can receive interrupts before the loop condition check or during the `sleep()`.
In the first case, it exits the loop without passing through `catch`; in the latter case, `sleep()` Throw `InterruptedException`.
`interruptionObserved` Record the cancellation signal on both paths, not using whether there is an exception or not to conclude that the Thread has received an interrupt.

**Final Thoughts** The cancellation must not only stop the execution, but also return the resource to a valid state.
