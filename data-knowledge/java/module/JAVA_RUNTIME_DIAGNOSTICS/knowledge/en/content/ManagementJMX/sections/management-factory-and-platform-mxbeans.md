java.lang.management.ManagementFactory is the primary entry point for JVM **platform MXBeans**.

Example:

~~~java
MemoryMXBean memory = ManagementFactory.getMemoryMXBean();
ThreadMXBean threads = ManagementFactory.getThreadMXBean();
RuntimeMXBean runtime = ManagementFactory.getRuntimeMXBean();
~~~

Platform MXBeans represent runtime components such as:

- ClassLoadingMXBean;
- CompilationMXBean;
- MemoryMXBean;
- MemoryPoolMXBean;
- GarbageCollectorMXBean;
- ThreadMXBean;
- RuntimeMXBean;
- OperatingSystemMXBean.

Some bean types have one instance while others return lists because a JVM can have several memory pools or collectors.

The important diagnostic property is that in-process code can read structured runtime state without parsing command output.
