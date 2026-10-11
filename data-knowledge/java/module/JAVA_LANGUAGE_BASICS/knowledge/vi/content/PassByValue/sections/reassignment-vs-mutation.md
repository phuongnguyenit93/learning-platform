```java
void replace(User user) {
    user = new User("new");
}
```

Gán lại tham số chỉ đổi biến tham số cục bộ. Tham chiếu của bên gọi vẫn trỏ đối tượng cũ.

So sánh:

```text
user.setName(...)
→ thay đổi đối tượng dùng chung

user = new User(...)
→ chỉ gán lại tham số cục bộ
```

Đây là mô hình tư duy nền tảng cho aliasing, sao chép phòng vệ và thiết kế API phương thức.

### Ví dụ `swap` kinh điển

```java
void swap(User a, User b) {
    User temp = a;
    a = b;
    b = temp;
}
```

Phương thức chỉ hoán đổi hai **tham số cục bộ**. Hai biến của bên gọi không đổi tham chiếu.

### Hệ quả đối với thiết kế API

Khi phương thức nhận đối tượng có thể thay đổi, hãy làm rõ hợp đồng:

- phương thức chỉ đọc đối tượng;
- phương thức thay đổi đối tượng bên gọi truyền vào;
- phương thức tạo và trả đối tượng mới;
- phương thức giữ tham chiếu để dùng lâu dài.

Nếu không muốn bên gọi và bên được gọi chia sẻ trạng thái có thể thay đổi, sao chép phòng vệ có thể là ranh giới phù hợp. Nhưng chính sách sao chép thuộc về hợp đồng API, không phải cơ chế pass-by-value tự động của Java.

Chương tiếp theo chuyển từ dữ liệu và lời gọi sang cách Java tổ chức tên kiểu bằng `package` và `import`.
