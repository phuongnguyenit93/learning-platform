Một giao diện hàm (functional interface) là giao diện mà hành vi trừu tượng của nó có thể được biểu diễn bằng **một hợp đồng hàm duy nhất**. Nhờ đặc điểm đó, Java có thể dùng giao diện này làm kiểu đích cho biểu thức lambda hoặc tham chiếu phương thức.

```java
@FunctionalInterface
interface TextRule {
    boolean test(String text);
}

TextRule nonEmpty = text -> !text.isEmpty();
```

Điểm cần nhìn vào là **hợp đồng hành vi**, không phải tổng số phương thức xuất hiện trong tệp. Một giao diện hàm vẫn có thể chứa phương thức `default`, `static` hoặc `private` vì các phương thức này đã có phần cài đặt và không tạo thêm hành vi trừu tượng mà lambda phải cung cấp.

Java dùng chính mô hình giao diện quen thuộc để biểu diễn hành vi. Không có một hệ "kiểu hàm" độc lập hoàn toàn với giao diện thông thường; giao diện hàm chính là cầu nối giữa hai cách nhìn này.
