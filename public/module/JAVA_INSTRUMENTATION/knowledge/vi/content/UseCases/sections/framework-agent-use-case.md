Nhiều framework/công cụ dùng Java Agent làm điểm khởi tạo cho hành vi cross-cutting ở runtime:

- APM/observability agent;
- công cụ test coverage;
- công cụ mock/profiling runtime;
- hook quét/bảo vệ bảo mật;
- chẩn đoán ORM/framework.

Mẫu chung:

~~~text
Java Agent
→ phát hiện phiên bản runtime/framework
→ chọn các module instrumentation
→ cài đặt transformer
→ chèn lời gọi tới agent runtime/helper
→ thu thập/điều khiển hành vi
~~~

Điều này giải thích vì sao agent dùng trong môi trường production thường có nhiều lớp hơn ví dụ nhỏ:

- matcher registry;
- quy tắc tương thích phiên bản;
- chèn helper;
- cấu hình;
- chuỗi xử lý telemetry;
- vô hiệu hóa/rollback an toàn.

Module này tập trung vào nền tảng Java Instrumentation để người học hiểu các hệ thống đó, không xây lại phần nội bộ của từng framework/vendor.
