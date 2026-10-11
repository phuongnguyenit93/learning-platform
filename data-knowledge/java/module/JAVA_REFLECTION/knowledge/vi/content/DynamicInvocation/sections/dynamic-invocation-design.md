Lời gọi động đáng dùng khi **đích thật sự chỉ được biết lúc chạy**. Ví dụ:

- framework chọn handler dựa trên annotation hoặc siêu dữ liệu định tuyến;
- serializer/deserializer chọn accessor/constructor theo class mô hình;
- hệ thống plugin nạp phần triển khai rồi gọi một hợp đồng được phát hiện;
- test/công cụ cần kiểm tra và gọi mã theo tên/chữ ký.

Nếu mã đã biết `PaymentService` và luôn cần gọi `pay(PaymentRequest)`, lời gọi trực tiếp đơn giản, an toàn kiểu và dễ tái cấu trúc hơn.

Khi lời gọi động là yêu cầu thật, nên thu hẹp nó thành một ranh giới có kiểm soát:

```java
final class PaymentInvoker {
    private final Method payMethod;

    PaymentInvoker(Class<?> serviceType) throws NoSuchMethodException {
        this.payMethod = serviceType.getMethod("pay", PaymentRequest.class);
    }

    String invoke(Object service, PaymentRequest request) {
        try {
            return (String) payMethod.invoke(service, request);
        } catch (InvocationTargetException ex) {
            throw new IllegalStateException("Payment target failed", ex.getCause());
        } catch (ReflectiveOperationException | IllegalArgumentException ex) {
            throw new IllegalStateException("Payment invocation contract is invalid", ex);
        }
    }
}
```

Ở đây việc tra cứu bằng chuỗi và ép kiểu tập trung tại adapter; phần còn lại của ứng dụng có thể dùng API có kiểu rõ ràng. `Method` được phân giải một lần thay vì tra cứu lại cho mỗi yêu cầu. Việc lưu đệm như vậy giảm tra cứu siêu dữ liệu lặp lại, nhưng không làm mất các đánh đổi khác của Reflection.

Đến đây milestone **Thao tác động bằng siêu dữ liệu** mới hoàn chỉnh: người học đã đi từ `get/set`, `invoke`, `newInstance` tới luồng phân phối lời gọi, chuyển đổi đối số, mảng động và ranh giới `MethodHandle`. Bước tiếp theo của ROADMAP là **Quyền truy cập, đóng gói và giới hạn mô-đun**: tìm thấy đối tượng mô tả chưa có nghĩa bên gọi được phép dùng nó. Sau đó người học mới đi tiếp tới siêu dữ liệu Generics, Dynamic Proxy và phần tổng hợp cuối mô-đun.
