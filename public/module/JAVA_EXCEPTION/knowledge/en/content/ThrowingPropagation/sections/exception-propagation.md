Reuse the module's running story:

```text
controller()
   ↓
service()
   ↓
repository()
   ↓
throw IOException
```

Example:

```java
void controller() throws IOException {
    service();
}

void service() throws IOException {
    repository();
}

void repository() throws IOException {
    throw new IOException("cannot read order");
}
```

No method catches the exception, so the flow is:

```text
repository()
→ stops at throw
→ leaves repository frame

service()
→ does not continue after repository()
→ leaves service frame

controller()
→ exception continues to controller's caller
```

Leaving those frames is **stack unwinding**.

### What happens while the stack unwinds?

When an exception is raised, Java first looks for a compatible `catch` in the active `try` constructs surrounding the failure in the current frame. If a handler catches it, propagation stops there.

If no compatible `catch` exists in the current frame, Java must leave active scopes before moving to the caller:

- an associated `finally` may still run;
- try-with-resources resources are closed according to their contract;
- after required cleanup completes, the current frame is left and handler search continues in the caller.

Example:

```java
void service() throws IOException {
    try {
        repository();
    } finally {
        System.out.println("service cleanup");
    }
}
```

`repository()` throws `IOException`, but the service `finally` executes before the exception continues upward.

### What if nobody catches it?

If an exception escapes the thread's entry point, it reaches that thread's uncaught-exception handling and the thread terminates by exceptional completion.

That does not necessarily mean “the whole JVM immediately dies”; process behavior also depends on other threads and the runtime context. The important mental model here is:

```text
no handler
→ failure continues to the thread's outer boundary
```

### WHY PROPAGATION EXISTS

A repository does not need to know:

- what a UI will display;
- which HTTP status a web boundary would produce;
- whether a batch job should retry;
- whether a higher layer will translate the exception.

The lower layer reports failure; policy belongs where enough context exists.
