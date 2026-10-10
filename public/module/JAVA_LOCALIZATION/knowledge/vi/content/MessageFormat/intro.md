# Thông điệp bản địa hóa có tham số

`ResourceBundle` giúp chọn **đúng mẫu câu**, nhưng nhiều thông điệp cần dữ liệu động:

```text
Đơn hàng 1001 có tổng tiền 1.234.567,89
Order 1001 totals 1,234,567.89
```

Cách đơn giản nhất là nối chuỗi, nhưng cấu trúc câu của mỗi ngôn ngữ có thể khác nhau. `MessageFormat` cho phép người dịch kiểm soát vị trí tham số trong cả câu.
