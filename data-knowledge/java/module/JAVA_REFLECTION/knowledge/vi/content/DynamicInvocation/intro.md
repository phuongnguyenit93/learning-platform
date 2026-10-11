# Thao tác động bằng siêu dữ liệu

Ba chương trước đã **khám phá** `Field`, `Method` và `Constructor` cùng siêu dữ liệu của chúng. Bây giờ milestone này dùng các đối tượng mô tả đã chọn để thực sự **đọc/ghi trạng thái, gọi hành vi và tạo đối tượng**. Khi siêu dữ liệu quyết định thao tác lúc chạy, trình biên dịch không còn chuẩn bị toàn bộ việc kiểm tra kiểu, chọn overload hay hình dạng đối số cho ta.

Với lời gọi trực tiếp:

```java
String result = service.pay(request);
```

Trình biên dịch biết `PaymentService`, biết chữ ký `pay(PaymentRequest)` và có thể báo sai kiểu ngay khi biên dịch. Với lời gọi qua Reflection, chương trình thường nhận class/tên/chữ ký từ siêu dữ liệu hoặc cấu hình rồi tự phân giải thành phần trước khi gọi.
