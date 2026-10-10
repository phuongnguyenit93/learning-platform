```java
static double sum(List<? extends Number> values) {
    double total = 0;
    for (Number value : values) {
        total += value.doubleValue();
    }
    return total;
}
```

Phương thức chấp nhận:

```java
List<Integer>
List<Double>
List<BigDecimal>
```

Ta biết phần tử là **một subtype chưa biết của `Number`**, nên đọc ra dưới dạng `Number` là an toàn.

Nhưng không thể:

```java
// values.add(1);   // compile error
// values.add(2.5); // compile error
```

Vì list thật có thể là `List<Double>`; thêm `Integer` sẽ phá an toàn kiểu.
