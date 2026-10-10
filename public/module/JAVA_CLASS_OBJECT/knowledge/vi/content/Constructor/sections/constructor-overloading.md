Một lớp có thể có nhiều hàm khởi tạo với danh sách tham số khác nhau.

```java
BankAccount(String id) {
    this(id, 0);
}
```

`this(...)` cho phép một hàm khởi tạo gọi hàm khởi tạo khác trong cùng lớp để gom logic khởi tạo về một nơi.

Chuỗi gọi hàm khởi tạo giúp tránh lặp lại kiểm tra dữ liệu. Với một lớp có lớp cha, nếu hàm khởi tạo không bắt đầu bằng `this(...)` hoặc `super(...)`, Java sẽ ngầm chèn lời gọi `super()` không tham số. Lời gọi đó phải khớp với một hàm khởi tạo có thể truy cập của lớp cha; nếu không, mã sẽ không biên dịch. `java.lang.Object` là ngoại lệ gốc vì nó không có lớp cha.
