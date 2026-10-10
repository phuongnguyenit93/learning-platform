NMT is **disabled by default** and must be enabled when the JVM starts:

~~~text
-XX:NativeMemoryTracking=summary
~~~

or:

~~~text
-XX:NativeMemoryTracking=detail
~~~

The levels serve different purposes:

- **summary** aggregates usage by subsystem/category and is often enough for trend analysis;
- **detail** adds call-site and virtual-memory-map information for deeper investigation at higher data/overhead cost.

Query a running JVM with:

~~~text
jcmd <pid> VM.native_memory summary
jcmd <pid> VM.native_memory detail
~~~

NMT can only be enabled with a JVM startup option. `jcmd` can **stop** NMT with `VM.native_memory shutdown`, but it cannot start or restart NMT in a running JVM. Once NMT has been shut down, enabling it again requires restarting the JVM with NMT configured at startup.
