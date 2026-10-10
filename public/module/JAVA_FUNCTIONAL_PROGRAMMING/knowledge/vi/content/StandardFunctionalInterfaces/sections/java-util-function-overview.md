Java cung cấp nhiều giao diện hàm dùng lại được trong gói `java.util.function`, nhờ vậy không cần tự tạo giao diện mới cho mọi hình dạng hành vi quen thuộc.

Khi chọn giao diện, câu hỏi quan trọng không phải là "nhớ được bao nhiêu tên API", mà là **hành vi có hợp đồng như thế nào**:

- biến một giá trị thành giá trị khác → `Function`;
- trả lời một điều kiện đúng/sai → `Predicate`;
- nhận giá trị rồi thực hiện hành động → `Consumer`;
- tạo ra giá trị mà không nhận đầu vào → `Supplier`;
- đầu vào và đầu ra cùng kiểu → có thể dùng giao diện toán tử;
- cần hai đầu vào → xem các nhóm `Bi...`.

```java
Function<String, Integer> length = String::length;
Predicate<String> nonEmpty = text -> !text.isEmpty();
Consumer<String> printer = System.out::println;
Supplier<UUID> idFactory = UUID::randomUUID;
```

Đây vẫn là các giao diện Java thông thường có một hợp đồng hàm. Lambda và tham chiếu phương thức chỉ là cú pháp ngắn gọn để cung cấp phần cài đặt cho hợp đồng đó.
