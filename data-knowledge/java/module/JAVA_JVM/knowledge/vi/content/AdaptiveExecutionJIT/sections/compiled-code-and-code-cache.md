Native code do JIT sinh ra cần được lưu ở vùng memory executable của JVM process. Trong HotSpot, người học thường gặp khái niệm **code cache**.

Code cache là implementation-level resource, không phải runtime data area được JVMS định nghĩa như heap hay JVM stack.

Điều này tạo một practical distinction:

```text
Java heap
→ Java objects

code cache / compiled-code memory
→ native machine code do runtime sinh
```

Vì vậy bộ nhớ tiến trình có thể tăng do compilation ngay cả khi heap usage gần như không đổi.

Chi tiết quan sát code cache hoặc compiler events thuộc tooling/diagnostics; module này chỉ đặt compiled-code memory vào đúng execution model.
