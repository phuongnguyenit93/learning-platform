NMT tracks HotSpot internal memory usage across categories such as Java Heap, Class, Thread, Code, GC, Compiler, Internal, Symbol, and others depending on the JDK build.

Its scope matters:

- NMT records allocations instrumented by HotSpot;
- it does **not** track allocations made by third-party native code;
- it also does **not** track allocations made by Oracle JDK class libraries;
- it is not an operating-system RSS monitor.

Therefore:

~~~text
RSS grows
NMT grows similarly
→ a JVM-managed native category is a strong candidate

RSS grows
NMT stays roughly flat
→ investigate memory outside NMT, mmap/file cache, allocator behavior, or OS-level causes
~~~

“NMT is flat” does not prove that native memory is healthy.
