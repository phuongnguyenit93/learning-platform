Mô-đun Java Core này chịu trách nhiệm cho các cơ chế ổn định dùng để biểu diễn hành vi có kiểu trong Java:

- quy tắc giao diện hàm và SAM;
- biểu thức lambda và cơ chế xác định kiểu theo ngữ cảnh (target typing);
- bắt giữ biến và phạm vi của lambda;
- các giao diện chuẩn trong `java.util.function`;
- tham chiếu phương thức và hàm tạo;
- kết hợp hành vi ở mức Java;
- `Optional` như API Java để biểu diễn khả năng vắng giá trị;
- các vấn đề thực tế như tác dụng phụ, ngoại lệ được kiểm tra (checked exception), khả năng đọc và lựa chọn phong cách viết.

Hai vùng lân cận được giữ thành ranh giới rõ ràng:

- lý thuyết lập trình hàm độc lập với ngôn ngữ thuộc mô-đun Mô hình lập trình hàm (Functional Programming) ở tầng mô hình lập trình;
- cơ chế chuỗi xử lý, đánh giá lười, phép rút gọn, bộ thu thập, thứ tự và xử lý song song thuộc mô-đun Stream API.

Nhờ tách như vậy, lộ trình học rõ ràng hơn: trước hết hiểu Java biểu diễn và kiểm tra kiểu của hành vi như thế nào, sau đó mới áp dụng cơ chế đó trong các API nhận hành vi.
