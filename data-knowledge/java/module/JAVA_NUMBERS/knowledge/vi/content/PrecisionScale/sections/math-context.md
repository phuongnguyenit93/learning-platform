`MathContext` kiểm soát **độ chính xác của phép toán** cùng chế độ làm tròn:

```java
MathContext context =
        new MathContext(4, RoundingMode.HALF_EVEN);

BigDecimal result =
        new BigDecimal("123.45").multiply(
                new BigDecimal("9.876"),
                context
        );
```

### `MathContext` khác `setScale`

```text
setScale
→ kiểm soát scale của kết quả
→ thường liên quan số chữ số thập phân/đơn vị của bài toán

MathContext
→ kiểm soát tổng độ chính xác của phép toán
→ có thể làm tròn các chữ số có nghĩa
```

Ví dụ:

```java
BigDecimal x = new BigDecimal("12345.67");

BigDecimal byScale =
        x.setScale(1, RoundingMode.HALF_UP);
// 12345.7

BigDecimal byPrecision =
        x.round(new MathContext(4, RoundingMode.HALF_UP));
// 1.235E+4
```

`MathContext.UNLIMITED` về cơ bản không giới hạn độ chính xác của phép toán, nhưng các phép toán như phép chia thập phân không kết thúc vẫn cần chính sách phù hợp.

Chương tiếp theo đi sâu vào làm tròn: **làm tròn là thay đổi kết quả số theo một chính sách cụ thể, không chỉ là định dạng đầu ra**.
