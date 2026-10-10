Instrumentation và Runtime Diagnostics có điểm giao nhau nhưng quyền sở hữu nội dung khác:

~~~text
Instrumentation
→ "làm sao chèn probe để thu dữ liệu?"

Runtime Diagnostics
→ "dữ liệu/thread dump/JFR/bằng chứng heap nói gì về sự cố?"
~~~

Ví dụ agent chèn timing probe và ghi p99 latency tăng. Instrumentation giải thích:

- probe được chèn vào đâu;
- class nào được biến đổi;
- overhead của probe;
- cấu hình runtime/retransform.

Runtime Diagnostics mới tiếp tục:

- latency tăng vì CPU, lock, GC hay I/O phía sau?
- bằng chứng thread/JFR nào xác nhận giả thuyết?

Ranh giới này tránh biến module thành khóa observability tổng hợp, đồng thời vẫn cho người học hiểu vì sao instrumentation là một cơ chế thu thập dữ liệu mạnh.
