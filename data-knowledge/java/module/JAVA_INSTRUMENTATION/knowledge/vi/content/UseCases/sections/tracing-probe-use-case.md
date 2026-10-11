Tracing agent thường chèn probe ở các ranh giới tạo hoặc truyền span:

~~~text
HTTP đi vào
→ bắt đầu server span

HTTP / DB / messaging đi ra
→ child span + truyền ngữ cảnh

method kết thúc/lỗi
→ kết thúc span
~~~

Instrumentation giúp tracing thư viện tích hợp với framework mà ứng dụng không phải gọi tracing API trực tiếp.

Nhưng việc truyền ngữ cảnh thường liên quan thread-local/object ngữ cảnh, callback bất đồng bộ hoặc luồng reactive. Transformer chỉ chèn điểm hook; ngữ nghĩa truyền ngữ cảnh thuộc thư viện tracing/runtime.

Một lỗi phổ biến là instrument cả ranh giới mức thấp lẫn mức cao rồi tạo span trùng. Việc chọn mục tiêu cần hiểu các lớp của framework và chọn một ranh giới ngữ nghĩa ổn định.
