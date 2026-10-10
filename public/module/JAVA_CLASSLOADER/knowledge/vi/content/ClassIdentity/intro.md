# Định danh class qua nhiều ClassLoader

Trong mã nguồn, ta thường nhận diện kiểu bằng tên:

```text
com.example.plugins.PaymentPlugin
```

Nhưng khi chạy, Java cần thêm một thông tin: **ClassLoader nào đã định nghĩa kiểu đó**.

Đây là lý do plugin có thể tách biệt không gian tên, đồng thời cũng là nguồn của những lỗi rất khó hiểu kiểu:

```text
PaymentPlugin cannot be cast to PaymentPlugin
```

Hai cái tên nhìn giống nhau, nhưng JVM đang nói về hai kiểu khác nhau khi chạy.
