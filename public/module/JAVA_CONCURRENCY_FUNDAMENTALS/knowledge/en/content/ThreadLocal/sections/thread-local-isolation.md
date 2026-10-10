For example:

```java
ThreadLocal<String> requestId = new ThreadLocal<>();

requestId.set("REQ-123");
try {
    code with Thread can requestId.get()
} finally {
    requestId.remove();
}
```

Two Threads Using the Same `ThreadLocal` The object can see two different values.

References:

```text
ThreadLocalController#isolation()
GET /context/isolation
```

The experiment creates two threads, each set a different request id and then rereads its own value.

**Final Thoughts** Isolation comes from thread-local association, not from lock or visibility synchronization on a shared value.
