# Mô hình kiểu lúc chạy với Class<?>

Chương trước đã xác định `Class<?>` là cửa vào của Reflection. Bây giờ ta cần trả lời câu hỏi đầu tiên mà một framework thường hỏi sau khi có đối tượng `Class`: **kiểu lúc chạy này là loại gì và có cấu trúc tổng quát ra sao?**

Siêu dữ liệu ở mức `Class` chưa đọc trạng thái của đối tượng và chưa gọi hành vi. Nó giúp mã phân loại kiểu, lấy tên ổn định phù hợp với mục đích, kiểm tra modifier, hiểu quan hệ kế thừa và quyết định sẽ khám phá thành phần theo quy tắc nào.

Ta tiếp tục dùng PaymentService:

~~~java
public interface PaymentProcessor {
    String pay(PaymentRequest request);
}

public class PaymentService implements PaymentProcessor {
    private final String provider;
    private int processedCount;

    public PaymentService(String provider) {
        this.provider = provider;
    }

    @Override
    public String pay(PaymentRequest request) {
        processedCount++;
        return provider + ":" + request.orderId();
    }

    private String internalStatus() {
        return provider + ":" + processedCount;
    }
}
~~~
