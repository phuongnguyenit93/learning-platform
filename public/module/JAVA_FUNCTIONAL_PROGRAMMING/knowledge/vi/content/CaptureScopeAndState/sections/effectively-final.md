Biến cục bộ, tham số phương thức hoặc tham số ngoại lệ được lambda bắt giữ phải là `final` hoặc **không bị gán lại sau khi khởi tạo (effectively final)**.

Một biến effectively final không cần ghi từ khóa `final`, nhưng sau khi được gán giá trị thì không bị gán lại:

```java
int minimum = 3;
Predicate<String> longEnough = text -> text.length() >= minimum;
```

Đoạn này hợp lệ vì `minimum` không bị gán lại.

```java
int minimum = 3;
minimum = 5;

// Không biên dịch vì minimum không còn effectively final.
Predicate<String> longEnough = text -> text.length() >= minimum;
```

Ràng buộc áp dụng cho chính **liên kết biến của biến cục bộ**, không áp dụng cho toàn bộ đồ thị đối tượng mà biến tham chiếu có thể trỏ tới. `final` hoặc effectively final chỉ ngăn biến tham chiếu trỏ sang đối tượng khác; nó không biến đối tượng thành bất biến.

Nếu một hành vi thật sự cần trạng thái thay đổi theo thời gian, nên mô hình hóa trạng thái đó rõ ràng thay vì dùng mẹo như mảng một phần tử chỉ để né quy tắc bắt giữ biến.
