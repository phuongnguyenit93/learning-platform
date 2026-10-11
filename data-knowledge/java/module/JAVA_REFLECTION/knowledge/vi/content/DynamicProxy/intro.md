# Proxy động và chặn lời gọi

Các chương trước dùng Reflection để tìm thành phần rồi thao tác trực tiếp với đối tượng mô tả. Dynamic Proxy đưa ý tưởng đó lên một mức trừu tượng cao hơn: thay vì ứng dụng tự gọi `Method.invoke()` ở mọi nơi, JDK có thể tạo một đối tượng lúc chạy **triển khai một hoặc nhiều interface** và chuyển mọi lời gọi interface qua một `InvocationHandler`.

Đây là nền tảng cho nhiều mẫu chặn lời gọi như ghi log (logging), phân quyền (authorization), ranh giới giao dịch, đo lường (metrics) hay client từ xa. Bên gọi vẫn thấy một interface có kiểu rõ ràng; phần động nằm phía sau proxy.

Để nối với ví dụ xuyên suốt, ta thêm một interface vì JDK Dynamic Proxy làm việc trên interface:

```java
interface PaymentGateway {
    String pay(PaymentRequest request);
}

final class PaymentGatewayImpl implements PaymentGateway {
    private final PaymentService service;

    PaymentGatewayImpl(PaymentService service) {
        this.service = service;
    }

    @Override
    public String pay(PaymentRequest request) {
        return service.pay(request);
    }
}
```
