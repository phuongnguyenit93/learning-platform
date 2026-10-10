# Khám phá Constructor và siêu dữ liệu khởi tạo

Field và Method đã mô tả trạng thái và hành vi. `Constructor` hoàn tất milestone **Khám phá các thành phần của lớp** bằng câu hỏi: **kiểu lúc chạy này khai báo những constructor nào và siêu dữ liệu nào giúp framework chọn đúng đối tượng mô tả?** Việc gọi `Constructor.newInstance(...)` được chuyển sang milestone **Thao tác động bằng siêu dữ liệu**.

Đây là nhu cầu rất phổ biến ở dependency injection container, hệ thống plugin, serializer/deserializer và quá trình khởi động framework. Framework nhận `Class<?>`, khám phá constructor rồi chọn đối tượng mô tả theo quy tắc của nó trước khi bước sang giai đoạn tạo đối tượng.

Mẫu xuyên suốt của mô-đun vẫn là:

~~~java
public class PaymentService {
    private final String provider;
    private int processedCount;

    public PaymentService(String provider) {
        this.provider = provider;
    }

    public String pay(PaymentRequest request) {
        processedCount++;
        return provider + ":" + request.orderId();
    }

    private String internalStatus() {
        return provider + ":" + processedCount;
    }
}
~~~

Riêng chương này ta thêm một overload để thấy cách chọn constructor:

~~~java
public PaymentService(String provider, int initialProcessedCount) {
    this.provider = provider;
    this.processedCount = initialProcessedCount;
}
~~~
