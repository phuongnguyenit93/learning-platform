Some operations support direct interruption, for example:

- `Thread.sleep(...)`;
- `Object.wait(...)`;
- `Thread.join(...)`;
- multiple API blocking in `java.util.concurrent`.

For example:

```java
try {
    Thread.sleep(30_000);
} catch (InterruptedException e) {
    Thread received interruption request
}
```

When `InterruptedException` thrown by APIs of this type, interrupt status is often **clear**.

Therefore in `catch`:

```java
Thread.currentThread().isInterrupted()
```

usually returned `false`.

If the method is not possible `throw InterruptedException` Next, it is necessary to preserve the cancellation signal for the code above, the common pattern is:

```java
catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    return;
}
```

This is called **Restore Interrupt Status**.

Not every `catch (InterruptedException)` are required to restore. If the method propagate the exception goes out, the caller has received a cancellation signal via the exception. Restore is especially useful when the exception is caught again and can't/reasonably shouldn't be thrown again.

### Demo in module

References:

```text
InterruptionController#interruptSleepingWorker()
```

Endpoint:

```text
GET /interruption/sleep
```

Worker Starts `sleep()` long, then service call `interrupt()`.

The response should be expressed:

```text
InterruptedException occurs
flag in catch before restore = false
flag after Thread.currentThread().interrupt() = true
Worker Ends
```

**Final Thoughts** Interruption of the blocking operation usually goes through `InterruptedException`; This exception and the interrupt flag are two ways to represent the same cancellation signal at different times.
