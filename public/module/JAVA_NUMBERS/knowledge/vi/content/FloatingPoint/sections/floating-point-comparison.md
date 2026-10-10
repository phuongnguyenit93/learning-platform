`==` chỉ nên dùng khi yêu cầu thực sự là **hai giá trị được biểu diễn phải bằng nhau chính xác**.

Với phép tính gần đúng, thường cần một ngưỡng sai số chấp nhận:

```java
double actual = 0.1 + 0.2;
double expected = 0.3;
double epsilon = 1e-9;

boolean close = Math.abs(actual - expected) <= epsilon;
```

Nhưng một epsilon tuyệt đối không phù hợp cho mọi độ lớn:

```text
giá trị quanh 0.000001
và
giá trị quanh 1_000_000_000

→ có thể cần chiến lược sai số chấp nhận khác nhau
```

Trong mã thực tế, mức sai số chấp nhận nên đến từ yêu cầu bài toán/ngân sách sai số, không phải một “epsilon thần kỳ” tùy ý.

Ngoài ra Java có:

```java
Double.compare(a, b);
Double.isFinite(value);
Double.isNaN(value);
```

`Double.compare` không có ngữ nghĩa giống hệt toán tử `==`: nó cung cấp thứ tự toàn phần (total ordering) hữu ích cho việc sắp xếp, trong đó NaN và số 0 có dấu được xử lý theo quy tắc của API. Vì vậy hãy chọn API theo câu hỏi mà bài toán đang cần trả lời.

Nếu vấn đề là **phạm vi số nguyên**, chương sau dùng `BigInteger`. Nếu vấn đề là **ngữ nghĩa thập phân chính xác**, ta sẽ tới `BigDecimal`.
