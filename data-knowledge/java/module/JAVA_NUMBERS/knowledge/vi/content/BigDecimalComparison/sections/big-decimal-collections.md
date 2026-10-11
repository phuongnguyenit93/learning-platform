### HashSet

```java
Set<BigDecimal> values = new HashSet<>();
values.add(new BigDecimal("1.0"));
values.add(new BigDecimal("1.00"));

System.out.println(values.size()); // 2
```

`HashSet` dùng `equals/hashCode`.

### TreeSet

```java
Set<BigDecimal> values = new TreeSet<>();
values.add(new BigDecimal("1.0"));
values.add(new BigDecimal("1.00"));

System.out.println(values.size()); // 1
```

`TreeSet` mặc định dùng thứ tự tự nhiên qua `compareTo`.

Đây là một trường hợp hiếm khi hai loại collection có thể coi cùng một cặp giá trị là “trùng lặp” theo hai cách khác nhau.

### Chuẩn hóa không phải giải pháp thần kỳ

`stripTrailingZeros()` có thể giúp đưa một số giá trị về dạng chuẩn:

```java
BigDecimal normalized =
        new BigDecimal("1.00").stripTrailingZeros();
```

nhưng chính sách chuẩn hóa phải được chọn có chủ ý. Nó có thể thay đổi scale, kể cả thành scale âm ở một số giá trị.

Nếu BigDecimal được dùng làm khóa của bài toán, hãy quyết định rõ:

```text
định danh dựa trên cách biểu diễn?
hay
định danh dựa trên đại lượng số học?
```

Sau các cách biểu diễn phức tạp, chương tiếp theo quay lại các tiện ích số chuẩn trong `Math`.
