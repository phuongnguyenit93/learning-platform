Hai phương thức synchronized riêng lẻ không làm một chuỗi nhiều bước trở thành nguyên tử.

Ví dụ logic kiểu:

```text
đọc độ dài
→ quyết định dựa trên độ dài
→ append
```

có thể bị luồng khác xen vào giữa các bước nếu bên gọi không có phạm vi đồng bộ hóa lớn hơn.

Ví dụ:

```java
if (buffer.length() < 100) {
    buffer.append(part);
}
```

`length()` và `append()` có thể được đồng bộ hóa riêng, nhưng chuỗi kiểm tra-rồi-thực-hiện ở bên gọi gồm **hai thao tác**. Luồng khác có thể thay đổi bộ đệm giữa chúng.

Nếu điều kiện bất biến cần bao phủ:

```text
đọc trạng thái
→ quyết định
→ thay đổi
```

thì phạm vi đồng bộ hóa phải bao phủ toàn bộ chuỗi thao tác hoặc thiết kế nên tránh bộ đệm có thể thay đổi dùng chung.

An toàn luồng phải được đánh giá ở **toàn bộ thao tác nghiệp vụ cần bảo vệ**, không chỉ nhìn annotation hoặc `synchronized` của từng phương thức.

Các cơ chế nguyên thủy của lập trình đồng thời, khóa và Java Memory Model không thuộc chương này; phần chuyên sâu đó thuộc mô-đun Concurrency.

Chương tiếp theo quay lại String Pool và giải thích việc chuẩn hóa tham chiếu có chủ đích bằng `String.intern()`.
