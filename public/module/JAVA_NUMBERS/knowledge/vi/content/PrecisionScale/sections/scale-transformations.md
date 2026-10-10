`setScale` tạo BigDecimal mới với scale mong muốn.

```java
BigDecimal value = new BigDecimal("12.345");
BigDecimal rounded =
        value.setScale(2, RoundingMode.HALF_UP);
```

Nếu tăng scale:

```java
new BigDecimal("12.3").setScale(4)
// 12.3000
```

thường không làm mất thông tin.

Nếu giảm scale:

```java
new BigDecimal("12.345").setScale(2)
```

thì sẽ có chữ số bị loại bỏ; nếu không cung cấp chế độ làm tròn phù hợp, phép toán có thể thất bại.

### `movePointLeft` / `movePointRight`

```java
BigDecimal x = new BigDecimal("123.45");

x.movePointLeft(2);  // 1.2345
x.movePointRight(2); // 12345
```

Các phương thức này thay đổi giá trị số theo lũy thừa của 10, khác với việc đơn thuần “định dạng số”.

### `stripTrailingZeros`

```java
BigDecimal x = new BigDecimal("1.2300");
BigDecimal normalized = x.stripTrailingZeros();
```

Giá trị số giữ nguyên nhưng cách biểu diễn/scale có thể thay đổi. Điều này quan trọng với `equals`, các collection dựa trên giá trị băm và chính sách chuẩn hóa.
