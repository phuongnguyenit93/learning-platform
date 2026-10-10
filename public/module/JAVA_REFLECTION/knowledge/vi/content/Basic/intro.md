# Reflection là gì và vì sao cần nó?

Reflection xuất hiện khi chương trình cần làm việc với **cấu trúc của mã như dữ liệu lúc chạy**. Nếu một đoạn mã đã biết chính xác kiểu nào, field nào và method nào cần dùng, Java cho phép gọi trực tiếp và trình biên dịch kiểm tra gần như mọi thứ từ trước. Nhưng một framework, serializer, test runner hoặc công cụ ánh xạ thường chỉ biết đối tượng thật sau khi chương trình đã chạy. Khi đó tên kiểu, field, method hoặc constructor có thể đến từ cấu hình, annotation hay chính đối tượng đang được xử lý.

Trong các ví dụ của module này, ta dùng một mô hình nhỏ xuyên suốt:

~~~java
public record PaymentRequest(String orderId, long amount) {}

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

Mục tiêu của chương này là hiểu **Reflection là gì, vì sao nó tồn tại và khi nào bài toán thực sự cần khả năng khám phá cấu trúc lúc chạy** trước khi học các API chi tiết.
