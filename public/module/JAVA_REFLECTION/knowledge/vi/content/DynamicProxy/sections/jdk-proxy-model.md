Trước khi nhìn API, hãy thấy bài toán mà proxy giải quyết. Không có proxy, ta có thể tự viết một lớp bọc để ghi log:

```java
final class LoggingPaymentGateway implements PaymentGateway {
    private final PaymentGateway target;

    LoggingPaymentGateway(PaymentGateway target) {
        this.target = target;
    }

    @Override
    public String pay(PaymentRequest request) {
        System.out.println("before pay");
        try {
            return target.pay(request);
        } finally {
            System.out.println("after pay");
        }
    }
}
```

Cách này hoàn toàn hợp lệ khi chỉ có một vài method. Nhưng nếu logic ghi log/phân quyền/đo lường phải lặp qua hàng chục interface và method, ta bắt đầu tạo rất nhiều lớp bọc gần như giống nhau. JDK Dynamic Proxy thay phần mã lặp đó bằng một ý tưởng:

```text
lời gọi interface có kiểu rõ ràng
        ↓
phần triển khai được tạo lúc chạy
        ↓
một InvocationHandler nhận Method + args
        ↓
chính sách chặn lời gọi/ủy quyền dùng chung
```

Đây là **lý do tồn tại** của JDK Proxy: giữ hợp đồng interface cho bên gọi nhưng gom logic dùng chung giữa nhiều lời gọi vào một handler chung.

`Proxy.newProxyInstance(...)` cần ba thành phần chính:

1. `ClassLoader` dùng để định nghĩa/phân giải proxy class;
2. danh sách interface mà proxy sẽ triển khai;
3. một `InvocationHandler` nhận các lời gọi.

Ở đây dùng `PaymentGateway.class.getClassLoader()` vì loader tạo proxy phải nhìn thấy các interface mà proxy sẽ triển khai. Chương này chỉ cần biết ràng buộc về khả năng nhìn thấy đó; định danh class, cơ chế ủy quyền và quan hệ giữa nhiều loader thuộc module ClassLoader.

```java
PaymentGateway target = new PaymentGatewayImpl(
        new PaymentService("stripe")
);

InvocationHandler handler = new LoggingHandler(target);

PaymentGateway proxy = (PaymentGateway) Proxy.newProxyInstance(
        PaymentGateway.class.getClassLoader(),
        new Class<?>[] { PaymentGateway.class },
        handler
);

String result = proxy.pay(new PaymentRequest("ORD-42", 150_000L));
```

Đối tượng `proxy` không phải instance của `PaymentGatewayImpl`. Nó là instance của một class được JDK tạo lúc chạy và class đó triển khai `PaymentGateway`. Vì vậy bên gọi có thể sử dụng interface với kiểu rõ ràng:

```java
PaymentGateway gateway = proxy;
gateway.pay(request);
```

Trong khi luồng gọi thực tế là:

```text
bên gọi
  ↓ PaymentGateway.pay(...)
đối tượng proxy được sinh tự động
  ↓ biểu diễn lời gọi thành Method + args
InvocationHandler.invoke(...)
  ↓ logic trung gian nếu có
đối tượng đích / đối tượng được ủy quyền
```

Dynamic Proxy vì thế không làm mất hợp đồng của interface. Nó chèn một ranh giới chặn lời gọi giữa bên gọi và phần triển khai.
