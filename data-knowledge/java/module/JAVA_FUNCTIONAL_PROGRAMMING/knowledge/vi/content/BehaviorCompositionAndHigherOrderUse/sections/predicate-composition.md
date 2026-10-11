`Predicate<T>` cung cấp `and`, `or` và `negate` để ghép các điều kiện nhỏ thành một quy tắc lớn hơn.

```java
Predicate<String> notBlank = text -> text != null && !text.isBlank();
Predicate<String> shortEnough = text -> text.length() <= 20;

Predicate<String> validName = notBlank.and(shortEnough);
```

`and` và `or` có cơ chế dừng sớm: điều kiện thứ hai chỉ được gọi khi kết quả của điều kiện đầu chưa đủ để quyết định kết quả cuối. Điều này rất quan trọng nếu điều kiện sau dựa vào một kiểm tra bảo vệ ở điều kiện trước.

Một `Predicate` nên hoạt động giống một câu hỏi. Nếu bên trong nó có thay đổi trạng thái hoặc I/O, một điều kiện tưởng như đơn giản có thể trở thành thao tác tốn kém hoặc phụ thuộc trạng thái.
