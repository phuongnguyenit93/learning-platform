Native library có thể thực hiện callback từ luồng khác với luồng đã tạo binding. Vì vậy callback code không được dựa vào giả định rằng nó luôn chạy trên cùng luồng với downcall.

Các câu hỏi cần trả lời:

- trạng thái Java mà callback dùng có thread-safe không?
- MemorySegment được callback truy cập có cho phép luồng hiện tại access không?
- Arena đang dùng là confined hay shared?
- native library có serialize callback hay có thể gọi đồng thời?

Nếu callback cần truy cập segment từ nhiều luồng, confined arena có thể không phù hợp. Shared arena mở quyền truy cập nhiều luồng nhưng ứng dụng vẫn phải đồng bộ hóa dữ liệu.

Boundary ở đây là tính an toàn của FFM callback/thread; cơ chế sâu của Java Memory Model hoặc MethodHandle không thuộc chương này.

Call và callback chạy được vẫn chưa đủ để integration an toàn. Chương tiếp theo gom các failure boundary lại thành một model thống nhất: ownership leak, loading/linkage error, lifetime sai, descriptor mismatch, native error channel và nguy cơ crash/corruption.
