Các giao diện quản lý của platform trả lời những câu hỏi khác nhau:

| Giao diện | Ví dụ câu hỏi |
| --- | --- |
| ThreadMXBean | số platform thread, deadlock, thread info |
| MemoryMXBean | heap/non-heap usage tổng quát |
| MemoryPoolMXBean | usage theo memory pool |
| GarbageCollectorMXBean | collection count/time |
| ClassLoadingMXBean | số class loaded/unloaded |
| CompilationMXBean | compilation time nếu VM hỗ trợ |
| RuntimeMXBean | uptime, định danh VM, input args |
| OperatingSystemMXBean | thông tin OS chuẩn; JDK extension bổ sung số liệu CPU/bộ nhớ của tiến trình và hệ thống |

Ví dụ:

~~~java
MemoryUsage heap = ManagementFactory
        .getMemoryMXBean()
        .getHeapMemoryUsage();

System.out.println(heap.getUsed());
~~~

Có hai interface cùng tên cần phân biệt:

- `java.lang.management.OperatingSystemMXBean` là API chuẩn, cung cấp tên/phiên bản/kiến trúc OS, số processor khả dụng và system load average;
- `com.sun.management.OperatingSystemMXBean` là JDK extension, bổ sung các số liệu như CPU time/load của tiến trình, committed virtual memory và physical/swap memory.

`ManagementFactory.getOperatingSystemMXBean()` trả về kiểu chuẩn ở compile time; trên JDK triển khai extension, object thực tế có thể implement `com.sun.management.OperatingSystemMXBean`. Chỉ dùng các method extension sau khi kiểm tra/cast phù hợp, và không trình bày chúng như API chuẩn của Java SE.
Đây là giao diện theo dõi, không phải công cụ tự tìm nguyên nhân gốc. Heap used tăng chỉ là tín hiệu; vẫn cần bằng chứng GC/heap/JFR để giải thích.

Trong Java 21, `ThreadMXBean` quản lý **platform thread**, không phải virtual thread. Đây là ranh giới quan trọng khi dùng management API cho ứng dụng dùng nhiều virtual thread.
