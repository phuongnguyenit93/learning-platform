`isPresent()` và `isEmpty()` cho biết `Optional` đang có hay không có giá trị.

`isPresent()` đã có từ Java 8, còn `isEmpty()` được bổ sung từ Java 11. Mã phải biên dịch với Java 8 không thể dùng `isEmpty()`.

```java
if (user.isPresent()) {
    System.out.println(user.get().name());
}
```

Đoạn mã trên hợp lệ, nhưng nếu liên tục kiểm tra rồi gọi `get()`, ta dễ quay lại kiểu rẽ nhánh thủ công mà `Optional` đang cố làm rõ. Khi phù hợp, `map`, `filter`, `ifPresent` hoặc các phương thức lấy giá trị thay thế giữ quyết định "có hay không" gắn với chính `Optional`.

Kiểm tra trực tiếp vẫn hợp lý khi luồng điều khiển xung quanh dễ hiểu hơn theo cách đó. `Optional` là công cụ thiết kế API, không phải quy tắc cấm dùng `if`.
