Một lời gọi qua Reflection có thể được nhìn như chuỗi bước:

```text
siêu dữ liệu Class
    ↓ tra cứu đúng Method
kiểm tra quyền truy cập
    ↓
kiểm tra đối tượng đích + đối số
    ↓
chuyển đổi cần thiết lúc chạy
    ↓
phân phối lời gọi method
    ↓
giá trị trả về hoặc lỗi
```

Ví dụ với mô hình xuyên suốt:

```java
PaymentService service = new PaymentService("stripe");
PaymentRequest request = new PaymentRequest("ORD-42", 150_000L);

Method pay = PaymentService.class.getMethod("pay", PaymentRequest.class);
Object result = pay.invoke(service, request);

System.out.println(result); // stripe:ORD-42
```

`getMethod("pay", PaymentRequest.class)` yêu cầu chữ ký cụ thể. Cơ chế tra cứu của Reflection không nhận một danh sách đối số lúc chạy rồi thực hiện toàn bộ quá trình chọn overload như trình biên dịch Java. Nếu class có `pay(String)` và `pay(PaymentRequest)`, mã động nên xác định chữ ký mong muốn rõ ràng.

Với instance method, `Method.invoke()` vẫn dùng cơ chế phân phối động trên đối tượng đích lúc chạy. Nghĩa là nếu `Method` đại diện cho method có thể override và đối tượng đích là instance của subclass đã override method đó, lời gọi vẫn có thể đi tới phần triển khai override. Reflection thay đổi **cách chọn đối tượng mô tả và ranh giới lời gọi**, không biến virtual dispatch thành static dispatch.

Các lỗi cũng nằm ở các giai đoạn khác nhau:

- tra cứu sai tên/chữ ký → `NoSuchMethodException`;
- thành phần không thể truy cập → `IllegalAccessException`;
- đối tượng đích sai kiểu, sai số đối số hoặc chuyển đổi không hợp lệ → `IllegalArgumentException`;
- đối tượng đích là `null` cho instance method → `NullPointerException`;
- chính method được gọi ném ngoại lệ → `InvocationTargetException` bọc ngoại lệ gốc.

Vì vậy mã framework thường tách “không phân giải được lời gọi” khỏi “method nghiệp vụ đã chạy nhưng thất bại”.

```java
try {
    return pay.invoke(service, request);
} catch (InvocationTargetException ex) {
    Throwable targetFailure = ex.getCause();
    // ánh xạ theo hợp đồng của lớp adapter hiện tại
    throw new IllegalStateException("Target method failed", targetFailure);
}
```
