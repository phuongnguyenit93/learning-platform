# Virtual Thread trong Java 2.

Virtual Thread là lightweight `Thread` implementation được JVM quản lý để giúp mô hình thread-per-task scale tốt hơn cho workload có nhiều thời gian chờ/blocking phù hợp.

Nó không thay đổi các quy tắc correctness đã học:

```text
race condition vẫn tồn tại
volatile/JMM vẫn tồn tại
lock vẫn cần khi shared mutable state cần bảo vệ
deadlock vẫn có thể xảy ra
```
