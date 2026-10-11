Giao diện hàm tổng quát (generic) làm việc với kiểu tham chiếu. Vì vậy khi dùng kiểu nguyên thủy thông qua kiểu như `Function<Integer, Integer>`, chương trình có thể phải đóng hộp/mở hộp (boxing/unboxing).

`java.util.function` cung cấp các biến thể chuyên biệt cho những hình dạng `int`, `long` và `double` thường gặp, ví dụ:

```java
IntPredicate positive = value -> value > 0;
IntUnaryOperator square = value -> value * value;
ToIntFunction<String> length = String::length;
IntFunction<String> label = value -> "#" + value;
```

Các giao diện này không tạo ra một mô hình lập trình khác. Chúng vẫn biểu diễn cùng kiểu hành vi, nhưng giúp tránh đối tượng bọc không cần thiết trong mã xử lý nhiều giá trị kiểu nguyên thủy.

Không cần tự động chọn biến thể chuyên biệt ở mọi nơi dùng kiểu nguyên thủy. Ưu tiên chúng khi API đã dùng biến thể đó hoặc khi chi phí đóng hộp thật sự đáng quan tâm; nếu không, độ rõ ràng của hợp đồng vẫn là tiêu chí chính.
