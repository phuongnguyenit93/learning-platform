Các phép toán chính:

```java
a.add(b);
a.subtract(b);
a.multiply(b);
a.divide(b);
a.remainder(b);
a.mod(b);
a.pow(3);
a.gcd(b);
```

### Phép chia BigInteger vẫn là phép chia số nguyên

```java
BigInteger seven = BigInteger.valueOf(7);
BigInteger two = BigInteger.valueOf(2);

System.out.println(seven.divide(two)); // 3
```

`BigInteger` giải quyết **phạm vi**, không biến phép toán số nguyên thành phép toán thập phân.

### `remainder` và `mod` không hoàn toàn đồng nghĩa

`remainder` tuân theo ngữ nghĩa phép dư số nguyên và có thể cho kết quả âm nếu số bị chia âm. `mod(m)` dùng số học mô-đun, yêu cầu mô-đun dương và trả kết quả không âm trong phạm vi `0 <= result < m`.

Đây là điểm khác biệt quan trọng trong lý thuyết số/phép toán mật mã; không nên thay hai phương thức cho nhau chỉ vì cả hai trông giống phép "%".

### So sánh

```java
int cmp = a.compareTo(b);
boolean same = a.equals(b);
```

Với BigInteger, quan hệ bằng nhau không có khác biệt về scale như BigDecimal.

### Chuyển đổi về kiểu nguyên thủy là một ranh giới quan trọng

```java
BigInteger huge = new BigInteger("999999999999999999999");

int truncated = huge.intValue();
```

`intValue()` có thể chỉ giữ lại các bit thấp thay vì báo lỗi. Nếu cần bảo đảm giá trị nằm gọn trong kiểu đích:

```java
int exact = huge.intValueExact();   // ArithmeticException nếu không nằm gọn trong kiểu
long exactLong = huge.longValueExact();
```

Quy tắc thực tế:

```text
BigInteger → kiểu nguyên thủy
→ coi như ranh giới thu hẹp kiểu
→ dùng chuyển đổi chính xác nếu tràn số phải được phát hiện
```

Nếu vấn đề không phải phạm vi số nguyên mà là **độ chính xác thập phân + chính sách làm tròn**, BigInteger chưa đủ; chương tiếp theo là `BigDecimal`.
