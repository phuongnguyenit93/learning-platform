Chọn theo nguồn của bytes mong muốn:

~~~text
có class bytes thay thế cụ thể?
→ redefineClasses

muốn chuỗi transformer tính lại instrumentation?
→ retransformClasses
~~~

Retransform phù hợp với:

- bật/tắt probe;
- cấu hình động;
- agent attach sau khi class đã được nạp;
- áp dụng cùng logic transformer cho class đã tồn tại.

Redefine phù hợp với:

- thay thế kiểu debugger/fix-and-continue;
- công cụ đã biên dịch/sinh đầy đủ định nghĩa thay thế.

Cả hai:

- cần khả năng tương ứng của JVM;
- cần class có thể sửa đổi;
- chịu giới hạn cấu trúc;
- không đặt lại trạng thái object/static;
- stack frame đang hoạt động có thể tiếp tục chạy code cũ.

Quyết định phải dựa trên ngữ nghĩa, không chỉ việc API có tồn tại.
