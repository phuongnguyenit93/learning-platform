Trình biên dịch chỉ tự tạo hàm khởi tạo mặc định không tham số khi lớp **không khai báo bất kỳ hàm khởi tạo nào**.

Ngay khi bạn viết một constructor:

```java
BankAccount(String id) { ... }
```

trình biên dịch không tự thêm `BankAccount()` nữa.

Điều này thường gây nhầm khi framework hoặc đoạn mã khác yêu cầu hàm khởi tạo không tham số.
