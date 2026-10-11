A native library may invoke a callback on a thread different from the Java thread that originally registered it. Treat that possibility as part of the callback contract unless the native API guarantees otherwise.

This matters because callback code can touch:

- Java state that requires synchronization;
- thread-local assumptions;
- `MemorySegment` values whose arena restricts thread access;
- native resources that have their own concurrency rules.

A confined segment owned by the registration thread is not automatically legal to access from a callback arriving on another thread. FFM thread-access checks can reject such access with `WrongThreadException`.

```text
native callback thread
      ↓
upcall stub
      ↓
Java callback
      ↓
only use state/resources valid for this thread and lifetime
```

If callbacks may be concurrent, design synchronization explicitly. If Java work must run on a particular executor/thread, make the callback a narrow handoff rather than doing arbitrary thread-sensitive work directly inside the upcall.

Being able to make calls and callbacks is not enough for a safe integration. The next chapter consolidates the failure model—ownership leaks, loading/linkage errors, invalid lifetimes, descriptor mismatches, native error channels, and crash/corruption risk.
