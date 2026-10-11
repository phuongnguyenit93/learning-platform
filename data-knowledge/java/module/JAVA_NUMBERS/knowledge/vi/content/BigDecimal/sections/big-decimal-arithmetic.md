BigDecimal là bất biến:

```java
BigDecimal amount = new BigDecimal("10.00");
BigDecimal fee = new BigDecimal("1.25");

amount.add(fee); // amount không đổi
amount = amount.add(fee);
```

Các phép toán chính:

```java
amount.add(fee);
amount.subtract(discount);
amount.multiply(rate);
amount.divide(divisor);
```

### Phép toán cũng mang theo ngữ nghĩa của scale

Không chỉ giá trị số thay đổi; scale ưu tiên của kết quả còn phụ thuộc phép toán. Ví dụ, khi không dùng `MathContext`:

```text
add/subtract
→ preferred scale thường là max(scale trái, scale phải)

multiply
→ preferred scale = scale trái + scale phải

phép chia chính xác
→ scale ưu tiên bắt đầu từ scale trái - scale phải,
  nhưng thương chính xác có thể cần scale lớn hơn
```

Vì vậy không nên đoán scale của kết quả chỉ bằng cách nhìn chuỗi đầu vào. Nếu bài toán yêu cầu scale đầu ra cố định, chính sách đó vẫn cần được áp dụng rõ ràng tại ranh giới thích hợp.

### Phép chia có thể cần chính sách làm tròn

```java
BigDecimal.ONE.divide(new BigDecimal("3"));
```

`1 / 3` không có biểu diễn thập phân hữu hạn, nên phép chia chính xác không thể hoàn thành và có thể ném `ArithmeticException`.

Bạn phải chỉ định chính sách:

```java
BigDecimal result =
        BigDecimal.ONE.divide(
                new BigDecimal("3"),
                4,
                RoundingMode.HALF_UP
        );
```

### BigDecimal không tự quyết định quy tắc nghiệp vụ

Nó không biết:

- tiền tệ cần scale 2 hay 0;
- thuế phải làm tròn từng dòng hay tổng cuối;
- tỷ lệ trung gian giữ bao nhiêu độ chính xác;
- quy định pháp lý dùng HALF_UP hay chế độ khác.

Đây là chủ đích thiết kế, không phải thiếu sót:

```text
BigDecimal
→ cung cấp phép toán thập phân

quy tắc nghiệp vụ
→ quyết định độ chính xác / scale / ranh giới làm tròn
```

Chương tiếp theo phân biệt **độ chính xác (precision) và scale**, hai khái niệm rất dễ bị dùng lẫn.
