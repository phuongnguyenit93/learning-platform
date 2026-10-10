The most important callback question is: **how long may native code retain and invoke this function pointer?**

Because an upcall stub is tied to an arena, closing that arena invalidates the stub. Passing its address to native code that stores it beyond the arena lifetime creates a dangling callback.

Unsafe lifecycle:

```text
create confined arena
      ↓
create upcall stub
      ↓
native library stores callback pointer
      ↓
close arena
      ↓
native library calls old pointer later
      ↓
invalid execution / crash risk
```

The arena lifetime must cover every possible native invocation of the callback. If the library has explicit register/unregister operations, unregister first, ensure callbacks can no longer arrive, then close the arena.

Also track any Java state captured by or reachable from the callback target. Callback ownership is not only the executable stub; it includes the resources the Java target needs to remain valid.
