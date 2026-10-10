Exception phù hợp với **sự kết thúc bất thường**, không nên thay thế nhánh bình thường có thể diễn đạt trực tiếp.

Khó đọc:

```java
try {
    return values.get(index);
} catch (IndexOutOfBoundsException ex) {
    return null;
}
```

nếu “index không tồn tại” thực ra là một trạng thái bình thường mà API có thể kiểm tra rõ ràng.

Rõ hơn trong nhiều ngữ cảnh:

```java
if (index < 0 || index >= values.size()) {
    return null;
}
return values.get(index);
```

### Nhưng exception ở ranh giới phân tích dữ liệu có thể hợp lý

```java
try {
    return Integer.parseInt(text);
} catch (NumberFormatException ex) {
    return defaultValue;
}
```

Ở đây API phân tích dữ liệu vốn dùng exception để báo đầu vào không thể chuyển đổi; bắt exception tại ranh giới nhỏ có chính sách rõ ràng.

Vấn đề không phải “exception chậm nên không bao giờ dùng”, mà là ý nghĩa của luồng xử lý:

```text
nhánh bình thường
→ diễn đạt bằng cấu trúc điều khiển bình thường

kết thúc bất thường
→ exception
```

Hiệu năng có thể là lý do bổ sung trên đường chạy được thực thi rất thường xuyên (hot path), nhưng tính dễ đọc và hợp đồng API mới là lý do thiết kế đầu tiên.
