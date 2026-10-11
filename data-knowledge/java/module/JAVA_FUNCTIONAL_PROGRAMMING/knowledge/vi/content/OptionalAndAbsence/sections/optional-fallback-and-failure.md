Chọn phương án thay thế dựa trên việc giá trị thay thế có rẻ, tốn kém, tiếp tục là `Optional` hay cần biến sự vắng mặt thành lỗi.

```java
String a = userName.orElse("anonymous");
String b = userName.orElseGet(this::loadDefaultName);
Optional<String> c = userName.or(this::lookupSecondaryName);
String d = userName.orElseThrow(UserNotFoundException::new);
```

Đối số của `orElse(value)` được tính trước khi gọi phương thức, kể cả khi `Optional` đang có giá trị. `orElseGet(supplier)` chỉ gọi hàm cung cấp khi không có giá trị. Khác biệt này quan trọng nếu phương án thay thế tốn tài nguyên hoặc có tác dụng phụ.

`or` là lựa chọn tính khi cần khi phương án thay thế cũng là một `Optional`. `orElseThrow` biến trường hợp vắng mặt thành thất bại và có thể tạo ngoại lệ phù hợp với ranh giới API.

`Optional.or` cũng được bổ sung từ Java 9. Nếu dự án phải giữ khả năng tương thích mã nguồn với Java 8, không nên giả định mọi phương thức của `Optional` hiện tại đều đã tồn tại ở phiên bản đó.
