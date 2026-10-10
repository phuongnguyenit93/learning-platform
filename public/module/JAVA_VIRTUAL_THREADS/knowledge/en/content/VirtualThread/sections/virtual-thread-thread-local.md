Virtual threads are still available `ThreadLocal` semantics by Thread. The difference in scalability is that applications can create a much larger number of threads, so placing large objects in ThreadLocal for each virtual thread can become significant heap pressure.

The rule is the same as the Context section:

```text
Set
→ try
→ work
→ finally remove/restore
```

Don't use ThreadLocal as a global cache just because virtual threads are cheap.

References:

```text
VirtualThreadController#threadLocal()
GET /virtual-thread/thread-local
```

Plain Experiment `ThreadLocal` On two virtual threads:

```text
firstThreadContext = request-A
firstThreadCleaned = true
secondThreadInheritedPlainThreadLocal=null
plainThreadLocalIsPerThread = true
```

**Final Thoughts** Virtual Thread doesn't change ThreadLocal's isolation/cleanup rule; its large scale makes memory discipline even more important.

### InheritableThreadLocal with Virtual Thread

`InheritableThreadLocal` There are still creation-time inheritance semantics. The newly created virtual thread can receive inherited value from the thread that created it.

But the Java 2. virtual-thread builder allows this behavior to be disabled:

```java
Thread.ofVirtual()
        .inheritInheritableThreadLocals(false)
        .start(task);
```

Experiment `/thread-local` Further observation:

```text
inheritableThreadLocalDefault = parent-context
inheritableThreadLocalWhenDisabled = null
virtualBuilderCanDisableInheritance = true
```

The important point remains: inheritance does not replace explicit context propagation. Contexts with their own lifecycle/request semantics should still be captured/restored/cleaned intentionally instead of implicitly depending on which new thread is created from.
