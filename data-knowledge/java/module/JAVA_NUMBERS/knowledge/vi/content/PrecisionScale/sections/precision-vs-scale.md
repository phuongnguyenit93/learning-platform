Với:

```text
123.45
```

ta có:

```text
precision = 5
→ tổng số chữ số của giá trị chưa áp dụng scale

scale = 2
→ số mũ thập phân dùng để đặt dấu thập phân
```

Trong mã:

```java
BigDecimal value = new BigDecimal("123.45");

System.out.println(value.precision()); // 5
System.out.println(value.scale());     // 2
```

### Scale không chỉ là “số chữ số sau dấu phẩy” trong mọi cách biểu diễn

Scale có thể bằng 0, dương hoặc âm:

```java
BigDecimal value =
        new BigDecimal("1000")
                .stripTrailingZeros();

System.out.println(value);       // có thể 1E+3
System.out.println(value.scale()); // có thể -3
```

Với scale âm, dấu thập phân trong cách biểu diễn được dịch sang phải.

Cách ghi nhớ chính xác hơn:

```text
giá trị = unscaledValue × 10^(-scale)
```
