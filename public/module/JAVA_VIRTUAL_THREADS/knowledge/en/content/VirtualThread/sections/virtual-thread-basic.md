Platform Thread is more closely tied to OS threads in the execution lifecycle.

Virtual Thread is Java `Thread` are mounted by the JVM scheduler on the carrier/platform thread when it needs to run.

Mental model:

```text
Virtual Thread
      ↓ mounted
Carrier/Platform Thread
      ↓
CPU code execution
```

When a virtual thread encounters a supported blocking operation, the runtime can unmount the virtual thread for the carrier to execute another virtual thread.

This allows for a larger number of pending tasks without the need for a separate OS thread for each task.

### Daemon and priority in Java 2.

Virtual threads are still `Thread`, but don't bring the entire assumption of the platform thread to it.

In Java 2.:

```text
virtual thread
→ is always Daemon Thread
→ Fixed Priority in Thread.NORM_PRIORITY
```

Since virtual threads are daemons, only virtual threads live **not enough to keep the JVM running**. This is a direct contact with the lifecycle daemon learned in the Basic section.

Priority also does not have to tune the knob to control the scheduling of the virtual thread. If you need to limit the concurrency/resource, use the appropriate abstraction such as semaphore, executor/resource pool, or rate limiter instead of trying to increase/decrease the thread priority.

References:

```text
VirtualThreadController#basic()
GET /virtual-thread/basic
```

Expected results:

```text
isVirtual = true
daemon = true
priority = 5
normalPriority = 5
stateAfterJoin=TERMINATED
```
