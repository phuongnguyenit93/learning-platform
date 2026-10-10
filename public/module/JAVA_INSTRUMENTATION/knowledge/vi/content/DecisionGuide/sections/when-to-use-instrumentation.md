Instrumentation phù hợp khi yêu cầu nằm ở **ranh giới định nghĩa class/runtime** thay vì API nghiệp vụ thông thường.

Các dấu hiệu:

- cần chèn probe dùng chung theo chiều ngang vào nhiều class mà không sửa mã nguồn;
- cần instrument code của thư viện phụ thuộc/framework;
- cần áp dụng logic ngay lúc class được nạp;
- cần thay đổi phần hiện thực method của class đã được nạp trong giới hạn JVM;
- cần agent hoạt động xuyên nhiều ứng dụng/module theo chính sách tập trung.

Chuỗi quyết định:

~~~text
sửa mã nguồn/proxy có giải quyết được không?
        ↓ không
có cần can thiệp lúc nạp class hoặc ở mức bytecode không?
        ↓ có
có chấp nhận agent đặc quyền chạy trong cùng tiến trình không?
        ↓ có
có thể kiểm thử tương thích JDK/class loader/module không?
        ↓ có
Instrumentation là một lựa chọn hợp lý
~~~

Đừng chọn chỉ vì “agent mạnh”. Chọn vì vấn đề thật sự nằm ở ranh giới mà Instrumentation sở hữu.
