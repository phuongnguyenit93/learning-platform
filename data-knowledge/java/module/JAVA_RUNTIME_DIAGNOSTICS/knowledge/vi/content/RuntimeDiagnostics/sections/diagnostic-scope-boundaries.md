Runtime Diagnostics đứng tại ranh giới giữa nhiều lĩnh vực, nên cần biết **đi đến đâu thì dừng**.

**JVM internals** giải thích cơ chế phía dưới. Khi GC log cho thấy pause dài, diagnostics giúp xác định thời điểm, tần suất và liên hệ với triệu chứng. Giải thích sâu collector algorithm, allocation mechanics hay JIT compilation strategy thuộc module JVM.

**Concurrency** sở hữu ngữ nghĩa và tính đúng đắn. Thread dump có thể cho thấy một monitor đang bị giữ, nhiều thread đang `BLOCKED`, hoặc một deadlock cycle. Việc giải thích memory model, happens-before, lock design và cách sửa synchronization đúng về mặt concurrency thuộc module Java Concurrency.

**Instrumentation** chủ động thay đổi hoặc chèn quan sát vào runtime, ví dụ Java Agent và bytecode transformation. Diagnostics trong module này ưu tiên các khả năng quan sát sẵn có của JDK/JVM. Nếu bài toán yêu cầu transform class để chèn probe thì đã chuyển sang ranh giới của Instrumentation.

**Observability platform** như metrics/logs/traces backend, APM hoặc công cụ vendor cung cấp hệ thống thu thập và phân tích ở quy mô lớn. Module này tập trung vào JDK/JVM diagnostic primitives và cách suy luận từ bằng chứng; kiến trúc telemetry platform không phải phạm vi chính.

Mental model nên giữ là:

```text
JVM / Concurrency
→ giải thích cơ chế

Runtime Diagnostics
→ quan sát bằng chứng và troubleshooting

Instrumentation
→ chủ động can thiệp / chèn quan sát

Observability platform
→ thu thập, lưu trữ và phân tích telemetry ở cấp hệ thống
```

Các ranh giới này không tách biệt tuyệt đối trong thực tế. Một sự cố có thể bắt đầu từ metric, dùng `jcmd` để lấy thread dump, chuyển sang JVM để giải thích hành vi GC, rồi sang Concurrency để sửa locking. Điều quan trọng là biết module nào sở hữu phần kiến thức nào để không biến một bài troubleshooting thành một khóa JVM hoặc concurrency đầy đủ.
