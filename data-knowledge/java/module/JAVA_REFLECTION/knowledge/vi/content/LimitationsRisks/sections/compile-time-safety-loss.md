Lời gọi trực tiếp tạo ra một hợp đồng mà trình biên dịch có thể kiểm tra:

```java
String result = service.pay(request);
```

Nếu `pay` bị đổi tên, kiểu tham số hoặc kiểu trả về thay đổi, mã gọi trực tiếp thường lỗi khi biên dịch. Với Reflection:

```java
Method method = service.getClass().getMethod(methodName, PaymentRequest.class);
Object result = method.invoke(service, request);
```

`methodName` có thể đến từ cấu hình hoặc annotation. Trình biên dịch không biết chuỗi đó có còn trỏ đến thành phần hợp lệ hay không. Sai tên, sai chữ ký, sai đối tượng đích hoặc sai đối số chỉ lộ ra khi luồng lúc chạy được thực thi.

Reflection còn làm luồng kiểu yếu hơn. `invoke()` trả `Object`, nên bên gọi thường phải ép kiểu. Siêu dữ liệu generic cũng chỉ mô tả khai báo; nó không tự khôi phục toàn bộ độ an toàn generic tại thời điểm biên dịch.

Đây không phải lý do cấm Reflection. Framework cần khám phá động thì không thể yêu cầu trình biên dịch biết trước mọi phần triển khai. Cách giảm rủi ro là đưa việc phân giải động vào một ranh giới nhỏ, kiểm tra sớm và cung cấp API có kiểu rõ ràng cho phần còn lại của ứng dụng.

```text
config/siêu dữ liệu động
        ↓ kiểm tra một lần
reflection adapter / registry
        ↓ hợp đồng có kiểu rõ ràng
mã ứng dụng
```
