TCCL is mutable thread state. That means temporary changes must have a clear lifecycle.

If concurrency is not yet familiar, the minimum model is enough: a **Thread is one execution flow**, while a **thread pool reuses a set of Threads for many tasks**. Because the same Thread may later run unrelated work, state attached to it must be restored.

Use the save/set/restore pattern:

```java
Thread thread = Thread.currentThread();
ClassLoader oldLoader = thread.getContextClassLoader();

try {
    thread.setContextClassLoader(pluginLoader);
    runPluginDiscovery();
} finally {
    thread.setContextClassLoader(oldLoader);
}
```

The `finally` block matters even when discovery throws. Request threads and executor workers are commonly reused. Leaving a plugin loader installed on a pooled thread means unrelated later work inherits the wrong discovery context.

For the same reason, a method that changes the TCCL should usually treat that change like acquiring a resource or changing transaction/security context: establish the smallest useful scope and restore the previous value before returning.

Avoid assuming the previous loader is always the system ClassLoader. Containers, test tools, IDEs, application servers, and other frameworks may already have installed a meaningful context loader. Restoring the exact previous value preserves the caller's environment.

Newly created threads commonly inherit their initial context ClassLoader from the creating thread. That inheritance is another reason plugin code must manage long-lived child threads carefully and stop them when the plugin lifecycle ends.
