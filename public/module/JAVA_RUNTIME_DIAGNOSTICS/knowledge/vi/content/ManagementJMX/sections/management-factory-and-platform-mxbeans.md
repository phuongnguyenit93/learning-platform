Lớp `java.lang.management.ManagementFactory` là điểm vào chính để lấy **platform MXBeans** của JVM.

Ví dụ:

~~~java
MemoryMXBean memory = ManagementFactory.getMemoryMXBean();
ThreadMXBean threads = ManagementFactory.getThreadMXBean();
RuntimeMXBean runtime = ManagementFactory.getRuntimeMXBean();
~~~

Platform MXBean đại diện cho một phần runtime, ví dụ:

- ClassLoadingMXBean;
- CompilationMXBean;
- MemoryMXBean;
- MemoryPoolMXBean;
- GarbageCollectorMXBean;
- ThreadMXBean;
- RuntimeMXBean;
- OperatingSystemMXBean.

Một số loại có đúng một instance, một số trả về list vì JVM có nhiều pool/collector.

Điểm quan trọng: API này cho phép code trong chính JVM đọc trạng thái mà không cần parse command output.
