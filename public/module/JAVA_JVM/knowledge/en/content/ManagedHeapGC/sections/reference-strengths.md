In addition to ordinary strong references, Java provides `SoftReference`, `WeakReference`, and `PhantomReference` for specialized coordination with reachability and garbage collection.

- **Strong** references keep objects strongly reachable through the ordinary object graph.
- **Soft** references may be cleared under memory pressure; they are historically associated with memory-sensitive caches but are not a precise cache policy.
- **Weak** references do not keep a referent alive solely because the weak reference exists; they fit weak ownership/canonicalization use cases.
- **Phantom** references support post-mortem lifecycle/cleanup coordination; `get()` always returns `null`.

Reference objects cooperate closely with the garbage collector. They are advanced tools; ordinary ownership is usually clearer with strong references plus explicit lifecycle management.
