With task concurrency, virtual-thread-per-task reduces the need for virtual pool threads to limit the number of OS workers like traditional platform-thread pools.

But the system still needs to be limited **Resource Downstream**:

- DB connections;
- API rate limit;
- memory;
- file descriptors;
- critical resource capacity.

The resource's semaphore/rate limiter/pool still plays a role.

In Java 21, a virtual thread is a thread daemon and uses `Thread.NORM_PRIORITY`; Don't use Thread Priority to control scalability. `InheritableThreadLocal` can still be inherit when the virtual thread is created, but `Thread.ofVirtual().inheritInheritableThreadLocals(false)` allow inheritance to be disabled. So explicit context propagation is still a safer mental model for request/security/logging context.
