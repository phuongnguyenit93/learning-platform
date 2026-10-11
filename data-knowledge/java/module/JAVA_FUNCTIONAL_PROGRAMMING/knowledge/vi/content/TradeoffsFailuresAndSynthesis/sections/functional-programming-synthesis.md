Mô hình tư duy đặc thù Java có thể nối lại thành một luồng duy nhất:

```text
hành vi thay đổi
    -> hợp đồng giao diện hàm
    -> lambda hoặc tham chiếu phương thức/hàm tạo
    -> kiểu đích kiểm tra tham số và kết quả
    -> có thể bắt giữ giá trị xung quanh
    -> truyền, trả về hoặc kết hợp hành vi
    -> gọi qua phương thức của giao diện hàm
    -> giữ rõ trạng thái, tác dụng phụ, ngoại lệ và khả năng đọc
```

Các giao diện chuẩn trong `java.util.function` cung cấp hợp đồng tái sử dụng; giao diện hàm tự định nghĩa phù hợp khi miền nghiệp vụ hoặc quy tắc ngoại lệ cần hợp đồng khác. `Optional` áp dụng cùng tinh thần đó cho sự vắng mặt tại một số ranh giới API. Stream API tái sử dụng các cơ chế này bằng cách nhận giá trị giao diện hàm, còn ngữ nghĩa xử lý riêng của Stream thuộc mô-đun Stream API.

Nên dùng phong cách hàm trong Java khi việc tham số hóa và kết hợp hành vi giảm lặp mã và làm ý định rõ hơn. Nên dùng cấu trúc mệnh lệnh hoặc hướng đối tượng khi quy trình có trạng thái, trách nhiệm đối tượng phong phú hoặc nhu cầu gỡ lỗi khiến chúng phù hợp hơn. Mục tiêu không phải là có thật nhiều lambda, mà là để hành vi và các ràng buộc của mã luôn dễ hiểu.
