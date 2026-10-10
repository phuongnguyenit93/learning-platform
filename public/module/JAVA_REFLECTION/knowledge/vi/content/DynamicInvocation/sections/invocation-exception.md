Một phân biệt quan trọng: lỗi có thể xảy ra **trước khi thân method chạy**, hoặc **bên trong chính thân method**.

Giả sử pay(...) từ chối amount không hợp lệ:

~~~java
public String pay(PaymentRequest request) throws PaymentException {
    if (request.amount() <= 0) {
        throw new PaymentException("amount must be positive");
    }
    processedCount++;
    return provider + ":" + request.orderId();
}
~~~

Gọi trực tiếp:

~~~java
service.pay(request);
~~~

sẽ ném `PaymentException` theo hợp đồng của method.

Gọi qua Method.invoke(...):

~~~java
try {
    method.invoke(service, request);
} catch (InvocationTargetException ex) {
    Throwable targetFailure = ex.getCause();
}
~~~

Ngoại lệ do thân method ném được bọc trong `InvocationTargetException`. Lớp bọc này tạo một ranh giới rõ:

~~~text
NoSuchMethodException
→ khám phá thất bại

IllegalAccessException
→ quyền truy cập phản chiếu không được phép

IllegalArgumentException
→ đối tượng nhận/đối số không phù hợp

InvocationTargetException
→ method đã được gọi, mã đích ném ngoại lệ
~~~

Framework thường nên lấy `cause` gốc rồi chuyển nó theo chính sách của framework. Không nên chỉ ghi log `InvocationTargetException` và bỏ mất ngoại lệ nghiệp vụ thật ở `getCause()`.

Cũng cần tránh kết luận rằng mọi `RuntimeException` khi gọi phản chiếu đều nằm ngoài lớp bọc. Nếu ngoại lệ phát sinh từ chính method đích, `invoke` biểu diễn nó qua `InvocationTargetException`; các lỗi do giao thức Reflection của bên gọi vẫn có loại lỗi riêng.
