### Tạo từ String

Khi có literal/chuỗi thập phân chính xác:

```java
BigDecimal rate = new BigDecimal("0.1");
```

### `valueOf(double)`

```java
BigDecimal value = BigDecimal.valueOf(0.1);
```

`valueOf(double)` dùng dạng chuỗi thập phân của `double`, nên với literal như `0.1` nó thường cho kết quả đúng với ý nghĩa thập phân mà người viết mã mong đợi.

### Lỗi thường gặp: `new BigDecimal(double)`

```java
BigDecimal bad = new BigDecimal(0.1);
```

Constructor nhận **giá trị dấu phẩy động nhị phân thực tế**, nên kết quả có thể giống:

```text
0.10000000000000000555...
```

### Quan trọng: BigDecimal không thể khôi phục ý nghĩa đã mất

```java
double x = 0.1 + 0.2;
BigDecimal value = BigDecimal.valueOf(x);
```

Ở đây phép toán dấu phẩy động đã xảy ra trước:

```text
0.1 + 0.2
→ giá trị xấp xỉ dấu phẩy động nhị phân
→ 0.30000000000000004
→ BigDecimal.valueOf(...)
```

BigDecimal không biết người viết mã “muốn” giá trị thập phân `0.3`.

Nếu ngữ nghĩa thập phân chính xác là yêu cầu, hãy giữ toàn bộ chuỗi tính toán ở BigDecimal ngay từ đầu:

```java
BigDecimal result =
        new BigDecimal("0.1")
                .add(new BigDecimal("0.2"));
```
