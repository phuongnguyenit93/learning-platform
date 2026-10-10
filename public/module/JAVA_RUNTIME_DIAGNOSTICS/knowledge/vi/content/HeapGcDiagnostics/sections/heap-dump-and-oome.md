Heap dump là ảnh chụp object graph của Java heap. Nó hữu ích khi cần hiểu **object nào đang tồn tại và vì sao chưa được thu gom**.

Tạo heap dump từ JVM đang chạy bằng jcmd:

~~~text
jcmd <pid> GC.heap_dump heap.hprof
~~~

Khi phân tích, thường quan tâm:

- retained size;
- dominator;
- GC roots;
- reference chain;
- classloader retention;
- cache/collection lớn bất thường.

`OutOfMemoryError` không tự động đồng nghĩa với memory leak. Heap có thể đơn giản là quá nhỏ, workload tăng, có đợt cấp phát đột biến, object graph hợp lệ quá lớn hoặc thực sự có leak.

Heap dump thường nặng và có thể tạo pause/disk pressure. Chapter Postmortem sở hữu việc tự động capture bằng HeapDumpOnOutOfMemoryError; chapter này sở hữu **phân tích** heap dump.
