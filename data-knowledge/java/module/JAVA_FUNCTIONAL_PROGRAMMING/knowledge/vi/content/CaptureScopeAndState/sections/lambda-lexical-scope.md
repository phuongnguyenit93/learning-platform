Lambda trong Java tuân theo **phạm vi từ vựng (lexical scope)**: tên được dùng bên trong lambda được tìm theo ngữ cảnh mã nguồn bao quanh, tương tự cách tên được phân giải trong phương thức hoặc khối chứa nó.

```java
class PriceService {
    private final BigDecimal taxRate = new BigDecimal("0.10");

    Function<BigDecimal, BigDecimal> taxedPrice() {
        BigDecimal serviceFee = new BigDecimal("2.00");

        return price -> price
                .add(serviceFee)
                .multiply(BigDecimal.ONE.add(taxRate));
    }
}
```

Thân lambda dùng được biến cục bộ `serviceFee` và trường `taxRate` vì cả hai đều nhìn thấy được tại vị trí khai báo lambda.

Lambda không tạo ra một phạm vi đối tượng mới cho `this` hoặc `super`. Đây là điểm khác quan trọng so với lớp vô danh và sẽ được làm rõ ở các mục phía dưới.
