Các utility chuyên biệt vẫn hữu ích vì bạn sẽ gặp chúng trong runbook, tài liệu cũ hoặc những tình huống mà đầu ra của chúng thuận tiện. Điều quan trọng là biết **mỗi công cụ trả lời loại câu hỏi nào**.

| Công cụ | Vai trò chính | Ví dụ |
| --- | --- | --- |
| `jps` | Liệt kê HotSpot JVM có thể quan sát trên máy/local VM namespace | `jps -lv` |
| `jstack` | In Java stack trace của thread; `-l` thêm thông tin lock | `jstack -l 12345` |
| `jmap` | Heap histogram, heap dump và một số heap/class-loader statistics | `jmap -histo 12345` |
| `jinfo` | Xem system properties và VM flags; một số flag có thể điều chỉnh tùy JVM | `jinfo -flags 12345` |
| `jstat` | Lấy mẫu HotSpot performance counters theo thời gian | `jstat -gcutil 12345 1000 10` |

Oracle đánh dấu `jstack`, `jmap` và `jinfo` là experimental/unsupported trong JDK 21 tool documentation và khuyến nghị `jcmd` cho các thao tác tương đương. Vì vậy, ví dụ:

```text
jstack -l <pid>
≈ khi phù hợp, ưu tiên jcmd <pid> Thread.print -l

jmap -histo <pid>
≈ khi phù hợp, ưu tiên jcmd <pid> GC.class_histogram

jmap -dump:format=b,file=heap.hprof <pid>
≈ khi phù hợp, ưu tiên jcmd <pid> GC.heap_dump heap.hprof
```

`jstat` có vai trò hơi khác. Nó đọc HotSpot instrumentation counters và rất hữu ích để quan sát **xu hướng**:

```bash
jstat -gcutil 12345 1000 10
```

Lệnh trên lấy 10 mẫu, mỗi mẫu cách 1 giây. Các cột như số GC, thời gian GC và mức sử dụng các vùng heap giúp bạn thấy hành vi thay đổi theo thời gian. Tuy nhiên các counter mang tính triển khai HotSpot; không nên biến một cột `jstat` thành kết luận nguyên nhân gốc nếu chưa liên hệ với collector, log và triệu chứng.

`jps` cũng cần dùng thận trọng: LVMID thường trùng OS PID nhưng không nên xây tự động hóa dựa trên giả định rằng mọi môi trường/container đều có cùng khả năng nhìn thấy tiến trình.

Hãy xem các utility này như những cửa sổ chuyên biệt vào JVM, với `jcmd` là giao diện tổng quát được ưu tiên cho chẩn đoán HotSpot hiện đại.
