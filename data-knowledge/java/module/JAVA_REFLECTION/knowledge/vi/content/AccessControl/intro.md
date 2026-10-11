# Quyền truy cập, đóng gói và giới hạn mô-đun

Các chương trước cho thấy Reflection có thể tìm `Field`, `Method` và `Constructor` dựa trên siêu dữ liệu thay vì gọi trực tiếp trong mã nguồn. Từ đây xuất hiện một câu hỏi quan trọng: nếu `getDeclaredMethod()` nhìn thấy cả method `private`, vậy `private` còn ý nghĩa gì không?

Điểm cần giữ trong đầu là **nhìn thấy siêu dữ liệu không đồng nghĩa với có quyền sử dụng thành phần đó**. Reflection cho phép chương trình mô tả cấu trúc lúc chạy; khi đọc field, gọi method hoặc tạo đối tượng, JVM vẫn áp dụng kiểm soát truy cập. `AccessibleObject` chỉ cung cấp một cơ chế có kiểm soát để yêu cầu bỏ qua một phần kiểm tra truy cập, và Java Module System có thể chặn yêu cầu đó.

Ta tiếp tục **đúng mẫu public class/public constructor** của các chương trước; chương này chỉ tập trung vào thành phần private để người học không nhầm rằng lỗi truy cập đến từ việc class ví dụ đã bị đổi:

```java
record PaymentRequest(String orderId, long amount) {}

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
```
