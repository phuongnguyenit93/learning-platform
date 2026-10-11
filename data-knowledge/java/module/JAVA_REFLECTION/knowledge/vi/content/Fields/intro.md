# Khám phá Field và siêu dữ liệu trạng thái

Sau khi chương **Mô hình kiểu lúc chạy với Class<?>** cho biết kiểu lúc chạy là gì, Reflection có thể khám phá **trạng thái được khai báo** của kiểu đó qua `Field`. Chương này tập trung vào việc tìm đúng field và đọc siêu dữ liệu của đối tượng mô tả; thao tác `get/set` sẽ được thực hiện ở milestone **Thao tác động bằng siêu dữ liệu**.

Ta tiếp tục với một `PaymentService` có cả field instance, static, final và generic:

~~~java
public class PaymentService {
    public static final String CHANNEL = "CARD";

    private final String provider;
    private int processedCount;
    private volatile boolean available = true;
    private List<String> supportedCurrencies = List.of("VND", "USD");

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

Field reflection có hai bước tách biệt: **khám phá đối tượng mô tả `Field`** rồi **dùng đối tượng mô tả đó trên một đối tượng nhận cụ thể**. Chương này chỉ tập trung vào bước khám phá; đọc/ghi giá trị nằm ở chương **Thao tác động bằng siêu dữ liệu**, còn ranh giới quyền truy cập được xử lý sau đó ở milestone **Quyền truy cập, đóng gói và giới hạn mô-đun**.
