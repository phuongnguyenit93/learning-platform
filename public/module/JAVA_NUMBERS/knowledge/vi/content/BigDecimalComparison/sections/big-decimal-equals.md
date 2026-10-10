`BigDecimal.equals` xét cả giá trị số **và scale**:

```java
BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("1.00");

System.out.println(a.equals(b)); // false
```

Ta có:

```text
a → unscaled 10,  scale 1
b → unscaled 100, scale 2
```

Hai đối tượng biểu diễn cùng một đại lượng toán học nhưng cách biểu diễn khác nhau.

### VÌ SAO equals làm như vậy?

`BigDecimal` xem scale là một phần của cách biểu diễn giá trị. Vì vậy `equals/hashCode` giữ sự khác biệt này.

Điều đó có nghĩa mã băm của `1.0` không cần bằng mã băm của `1.00`.
