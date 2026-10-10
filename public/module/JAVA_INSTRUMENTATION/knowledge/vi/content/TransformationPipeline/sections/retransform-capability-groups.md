Khi retransformClasses() được gọi, hai nhóm Java transformer khác nhau rõ rệt:

**canRetransform=false**

- transform() **không được gọi lại**;
- JVM tái sử dụng đầu ra mà transformer đó tạo ở lần nạp/redefine trước;
- hiệu ứng cũ được tự động áp dụng lại vào chuỗi biến đổi.

**canRetransform=true**

- transform() được gọi lại;
- transformer nhận đầu vào sau khi phần không hỗ trợ retransformation đã được tái áp dụng;
- transformer có thể tạo đầu ra mới dựa trên cấu hình/trạng thái hiện tại.

Mô hình tư duy:

~~~text
bytes ban đầu / lần redefine gần nhất
        ↓
tái sử dụng đầu ra trước đó của transformer không hỗ trợ retransformation
        ↓
gọi lại các transformer hỗ trợ retransformation
        ↓
verify + cài định nghĩa
~~~

Đây là lý do khả năng được chọn lúc addTransformer, không phải lúc gọi retransformClasses.
