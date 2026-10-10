Khi HotSpot gặp lỗi nghiêm trọng ở mức VM hoặc native code, nó thường tạo **fatal error log**. Tên mặc định có dạng hs_err_pid<PID>.log; vị trí có thể cấu hình bằng tùy chọn -XX:ErrorFile.

Fatal error log thường chứa nhiều lớp bằng chứng trong cùng một file:

- loại signal/exception đã làm JVM dừng;
- thread đang thực thi tại thời điểm lỗi;
- native và Java stack liên quan;
- thông tin VM, GC, heap và command line;
- danh sách dynamic library đã được load;
- thông tin hệ điều hành và CPU;
- đôi khi có ngữ cảnh register/memory phụ thuộc nền tảng.

Điều cần tránh là đọc một dòng “problematic frame” rồi kết luận đó chắc chắn là nguyên nhân gốc. Frame đó cho biết nơi crash được quan sát, nhưng nguyên nhân có thể nằm ở memory corruption xảy ra trước đó, JNI contract bị vi phạm, lỗi thư viện native hoặc lỗi VM.

Quy trình thực dụng:

1. xác nhận timestamp/PID đúng với sự cố;
2. đọc phần header và problematic frame;
3. xác định lỗi nằm trong JDK/VM, thư viện native của ứng dụng hay thư viện của hệ điều hành;
4. đối chiếu current thread + stack;
5. kiểm tra command-line flags và môi trường;
6. sau đó mới quyết định có cần core dump, symbol hoặc phân tích sâu hơn trong Native Interoperability.
