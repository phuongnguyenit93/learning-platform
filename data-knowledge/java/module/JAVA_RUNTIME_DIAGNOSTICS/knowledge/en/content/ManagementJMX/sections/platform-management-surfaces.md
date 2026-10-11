Different platform management surfaces answer different questions:

| Surface | Example question |
| --- | --- |
| ThreadMXBean | platform-thread count, deadlocks, thread info |
| MemoryMXBean | aggregate heap/non-heap usage |
| MemoryPoolMXBean | usage by memory pool |
| GarbageCollectorMXBean | collection count/time |
| ClassLoadingMXBean | loaded/unloaded class counts |
| CompilationMXBean | compilation time when supported |
| RuntimeMXBean | uptime, VM identity, input arguments |
| OperatingSystemMXBean | standard OS information; the JDK extension adds process/system CPU and memory data |

Example:

~~~java
MemoryUsage heap = ManagementFactory
        .getMemoryMXBean()
        .getHeapMemoryUsage();

System.out.println(heap.getUsed());
~~~

There are two interfaces with the same simple name that should not be conflated:

- `java.lang.management.OperatingSystemMXBean` is the standard Java SE management interface. It exposes OS name/version/architecture, available processors, and system load average;
- `com.sun.management.OperatingSystemMXBean` is a JDK extension that adds process CPU time/load, committed virtual memory, and physical/swap-memory information.

`ManagementFactory.getOperatingSystemMXBean()` is typed as the standard interface. On a JDK that implements the extension, the returned object may also implement `com.sun.management.OperatingSystemMXBean`; use extension methods only after an appropriate type check/cast, and do not present them as standard Java SE API.
These are monitoring surfaces, not root-cause engines. Rising heap usage is a signal that still needs GC, heap, or JFR evidence for explanation.

In Java 21, ThreadMXBean supports **platform threads**, not virtual threads, which is an important boundary for Loom-heavy applications.
