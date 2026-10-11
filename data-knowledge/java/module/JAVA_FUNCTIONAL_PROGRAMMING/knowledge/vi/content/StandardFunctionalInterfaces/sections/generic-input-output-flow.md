Các tham số kiểu của giao diện hàm chuẩn làm rõ hướng dữ liệu đi qua hành vi.

Với `Function<T, R>`:

```text
T  ──apply──>  R
```

Với `BiFunction<T, U, R>`:

```text
T + U  ──apply──>  R
```

Với `Predicate<T>`, `T` là đầu vào còn `boolean` là đầu ra cố định. Với `Consumer<T>`, `T` là đầu vào và không có đầu ra. Với `Supplier<T>`, không có tham số đầu vào còn `T` là giá trị được tạo ra.

Quan hệ này rất hữu ích khi đọc API dùng kiểu tổng quát (generic):

```java
Function<Order, BigDecimal> total = Order::total;
```

Chỉ nhìn vào kiểu đã có thể hiểu luồng chính: `Order` đi vào và `BigDecimal` đi ra, trước cả khi đọc thân lambda.

Khi học cách kết hợp ở chương sau, việc theo dõi kiểu đầu ra của hành vi trước có khớp kiểu đầu vào của hành vi sau hay không cũng dựa trên mô hình tư duy này.
