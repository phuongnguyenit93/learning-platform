`&&` và `||` sử dụng đánh giá ngắn mạch (short-circuit):

```java
user != null && user.isActive()
```

Nếu `user != null` là `false`, vế phải không được đánh giá.

Điều này không chỉ tối ưu hiệu năng; nó còn giúp bảo đảm tính đúng đắn, chẳng hạn tránh truy cập qua tham chiếu `null` hoặc tránh tác dụng phụ không mong muốn.

`&` và `|` với boolean đánh giá cả hai vế, nên ngữ nghĩa khác.

### Điều kiện bảo vệ theo thứ tự an toàn

```java
if (user != null && user.isActive()) {
    process(user);
}
```

Đảo hai vế sẽ làm điều kiện bảo vệ mất tác dụng:

```java
// user.isActive() được đánh giá trước
// nên user == null có thể gây NPE
if (user.isActive() && user != null) { }
```

Vì đánh giá ngắn mạch quyết định **vế phải có được chạy hay không**, đừng đặt tác dụng phụ quan trọng vào vế phải nếu logic chương trình yêu cầu tác dụng phụ đó luôn xảy ra.

### Toán tử điều kiện `?:`

Toán tử điều kiện là một **biểu thức** tạo ra giá trị:

```java
String label = active ? "ACTIVE" : "INACTIVE";
```

Mô hình thực thi:

```text
đánh giá điều kiện
├─ true  → chỉ đánh giá nhánh thứ hai
└─ false → chỉ đánh giá nhánh thứ ba
```

Giống toán tử boolean đánh giá ngắn mạch, Java chỉ đánh giá **một** trong hai biểu thức kết quả:

```java
String name = user != null ? user.getName() : "anonymous";
```

Kiểu của toàn bộ biểu thức điều kiện được trình biên dịch xác định từ hai nhánh theo các quy tắc kiểu/chuyển đổi tương ứng. Với logic nhiều bước hoặc nhiều `?:` lồng nhau, `if/else` thường dễ đọc hơn.
