Không phải mọi `static final` đều là hằng số tại thời điểm biên dịch.

```java
static final int MAX_DAILY_WITHDRAWALS = 3;          // compile-time constant
static final int CONFIGURED_LIMIT = Integer.parseInt("3"); // không phải compile-time constant
```

Giá trị đầu là kiểu nguyên thủy được khởi tạo từ biểu thức hằng nên có thể được chèn trực tiếp vào bytecode của mã sử dụng. Giá trị thứ hai cần gọi phương thức nên chỉ được xác định khi chương trình chạy.

Hằng số tại thời điểm biên dịch phải đáp ứng các quy tắc cụ thể về kiểu nguyên thủy/`String` và biểu thức hằng. Điều này ảnh hưởng tới việc chèn trực tiếp giá trị và một số hành vi khi thư viện thay đổi hằng số nhưng mã sử dụng chưa được biên dịch lại.

Tên `UPPER_SNAKE_CASE` là quy ước phổ biến cho hằng số, nhưng ngữ nghĩa của hằng số quan trọng hơn kiểu đặt tên.

Chương tiếp theo đi vào các khối khởi tạo nằm ngoài thân hàm khởi tạo.
