### No swallow InterruptedException

The code is as follows to lose the cancellation signal:

```java
try {
    Thread.sleep(1000);
} catch (InterruptedException e) {
    Skip
}
```

Instead, usually choose one of two directions:

```text
1. propagate InterruptedException

or

2. Restore Interrupt Status and End/Return
```

### CPU-bound tasks must have a cancellation point

If the task runs a long loop without calling the interruptible API, it is necessary to actively check:

```java
Thread.currentThread().isInterrupted()
```

It is not necessary to check after each instruction; the cancellation point should be placed in a reasonable position to balance responsiveness and testing costs.

### Cleanup must be deterministic

Normal learning demos must not leave threads alive after the endpoint is complete.

Service in this chapter is always `join()` worker with timeout and have a cleanup fallback if needed.

### Do not mix Thread Pool shutdown into the basic mental model

`ExecutorService.shutdown()`, `shutdownNow()`, `awaitTermination()` and the Spring executor lifecycle is associated with interruption but belongs to higher abstraction.

They'll be learned in the Thread Pool/Executor and Lifecycle sections instead of being used to explain basic interrupts here.
