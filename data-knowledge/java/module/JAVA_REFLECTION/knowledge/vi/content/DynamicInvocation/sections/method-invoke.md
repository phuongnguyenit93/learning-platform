Sau khi đã chọn đúng `Method`, `invoke(receiver, args...)` thực hiện lời gọi:

~~~java
PaymentService service = new PaymentService("stripe");
PaymentRequest request = new PaymentRequest("ORD-1", 100_000);

Method method = PaymentService.class.getMethod(
        "pay",
        PaymentRequest.class
);

Object result = method.invoke(service, request);
String paymentId = (String) result;
~~~

`Method.invoke()` trả `Object`. Giá trị trả về primitive sẽ được boxing; method trả `void` cho kết quả `null`.

Đối tượng nhận phải tương thích với class khai báo đối với instance method. Nếu method là static, đối tượng nhận bị bỏ qua và thường truyền `null`:

~~~java
Method parse = Long.class.getMethod("parseLong", String.class);
Object value = parse.invoke(null, "100");
~~~

Lời gọi có thể thực hiện unboxing và primitive widening tương thích với quy tắc của Reflection, nhưng không chạy lại toàn bộ cơ chế chọn overload tại thời điểm biên dịch của Java. Nếu đối tượng mô tả đã là method nhận `long`, `Integer` có thể được mở hộp/mở rộng phù hợp; một `String` "100" sẽ không tự chuyển thành `long`.

Sai đối tượng nhận, sai số lượng đối số hoặc đối số không chuyển đổi được dẫn tới `IllegalArgumentException`. Method không thể truy cập từ bên gọi có thể dẫn tới `IllegalAccessException`. Cách thay đổi quyền truy cập phản chiếu thuộc chương **Quyền truy cập, đóng gói và giới hạn mô-đun**.

Một cách tổ chức tốt cho framework là tách rõ bước khám phá khỏi bước gọi:

~~~java
Method payMethod = resolvePaymentMethod(PaymentService.class);

// kiểm tra/lưu đệm một lần

Object result = payMethod.invoke(service, request);
~~~

Điều này tránh tra cứu bằng chuỗi ở mọi yêu cầu và gom lỗi cấu hình về giai đoạn khởi động thay vì để rải rác trong luồng nghiệp vụ.
