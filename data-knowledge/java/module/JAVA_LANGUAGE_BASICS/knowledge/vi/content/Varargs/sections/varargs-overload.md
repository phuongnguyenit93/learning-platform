`varargs` thường được xét như phương án cuối sau các ứng viên có số lượng tham số cố định phù hợp.

Do đó thêm một overload `varargs` có thể ảnh hưởng tập phương thức nạp chồng theo cách không hiển nhiên, đặc biệt khi kết hợp boxing, mở rộng kiểu hoặc `null`.

API công khai có nhiều overload + `varargs` nên được kiểm thử với các lời gọi đại diện để tránh sự mơ hồ ngoài ý muốn.

Ví dụ phương thức có số lượng tham số cố định thường được ưu tiên trước `varargs`:

```java
void send(String value) { }
void send(String... values) { }

send("one"); // chọn overload số lượng tham số cố định
```

Nhưng `null` có thể làm tập overload khó đọc vì `null` tương thích với nhiều kiểu tham chiếu/mảng. Đừng thêm overload chỉ để “tiện” nếu nó làm ngữ nghĩa tại vị trí gọi trở nên mơ hồ.
