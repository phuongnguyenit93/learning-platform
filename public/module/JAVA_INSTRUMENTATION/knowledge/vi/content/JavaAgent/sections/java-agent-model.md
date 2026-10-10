Java Agent là một thành phần Java được JVM khởi động theo quy ước đặc biệt để thực hiện công việc trước hoặc trong khi ứng dụng đang chạy. Điểm khác với thư viện thông thường là ứng dụng không nhất thiết phải gọi agent. Chính JVM gọi điểm vào của agent và có thể truyền vào một đối tượng Instrumentation.

Mô hình tư duy:

~~~text
agent JAR
  ↓ manifest chọn agent class
agent class
  ↓ premain hoặc agentmain
Instrumentation instance
  ↓
đăng ký transformer / xem class đã nạp / yêu cầu retransform-redefine
~~~

Agent thường sống cùng tiến trình với ứng dụng. Vì vậy lỗi, deadlock, rò rỉ bộ nhớ hoặc xung đột phụ thuộc trong agent có thể ảnh hưởng trực tiếp tới ứng dụng. Ta nên xem agent như hạ tầng runtime chạy **trong cùng tiến trình (in-process)**, không phải một dịch vụ độc lập.
