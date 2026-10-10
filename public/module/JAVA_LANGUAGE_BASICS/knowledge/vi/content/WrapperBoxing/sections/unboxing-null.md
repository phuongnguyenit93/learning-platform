Kiểu bao có thể là `null`:

```java
Integer boxed = null;
int value = boxed; // NullPointerException
```

Mở hộp cần một đối tượng kiểu bao thực sự để lấy giá trị nguyên thủy. Vì vậy API dùng kiểu bao có thể `null` có thêm một kiểu lỗi mà kiểu nguyên thủy không có.

Rủi ro này có thể ẩn trong biểu thức tưởng như vô hại:

```java
Integer count = null;

// cả ba đều có thể kích hoạt unboxing
int x = count;
int y = count + 1;
if (count > 0) { }
```

Nếu `null` mang ý nghĩa nghiệp vụ hợp lệ, mã nên xử lý trạng thái vắng mặt trước khi mở hộp. Nếu `null` không hợp lệ, kiểm tra sớm tại ranh giới thay vì để NPE xuất hiện xa nguồn.

Chương tiếp theo xem các toán tử kết hợp giá trị và những chuyển đổi ngầm có thể xảy ra trong biểu thức.
