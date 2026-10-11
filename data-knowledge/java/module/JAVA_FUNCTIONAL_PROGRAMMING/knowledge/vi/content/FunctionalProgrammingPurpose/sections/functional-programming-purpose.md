Trong Java, lập trình hàm là cách viết một phần chương trình theo hướng **biểu diễn hành vi thành giá trị có kiểu**, để hành vi đó có thể được truyền vào, lựa chọn, kết hợp hoặc thực thi sau. Java không tạo ra một hệ kiểu hàm tách biệt khỏi hệ kiểu thông thường. Thay vào đó, hành vi được biểu diễn thông qua **giao diện hàm (functional interface)**, còn lambda hoặc tham chiếu phương thức cung cấp phần cài đặt cho hợp đồng hàm đó.

Điểm thay đổi quan trọng là chương trình không chỉ truyền dữ liệu, mà còn có thể truyền **cách xử lý dữ liệu**.

```java
boolean isAdult(int age) {
    return age >= 18;
}

Predicate<Integer> rule = age -> age >= 18;
```

Đoạn đầu là một phương thức thông thường. Đoạn sau đóng gói hành vi tương đương phía sau hợp đồng `Predicate<Integer>`, nhờ vậy một API khác có thể nhận hành vi này như một giá trị.

Java vẫn là ngôn ngữ đa mô hình. Phong cách hàm bổ sung cho cách viết hướng đối tượng và mệnh lệnh; nó đặc biệt hữu ích khi phần cần thay đổi chính là **hành vi**.
