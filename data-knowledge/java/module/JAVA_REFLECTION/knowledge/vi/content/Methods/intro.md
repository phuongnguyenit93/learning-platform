# Khám phá Method và chữ ký phương thức

Sau `Field`, milestone **Khám phá các thành phần của lớp** chuyển sang **hành vi**: tìm `Method` theo siêu dữ liệu và đọc chữ ký của nó mà không cần biết trước method cụ thể trong mã nguồn. Việc thực sự gọi `Method.invoke(...)` được dành cho milestone **Thao tác động bằng siêu dữ liệu**.

Ta tiếp tục với mô hình chung:

~~~java
public class PaymentService {
    private final String provider;
    private int processedCount;

    public PaymentService(String provider) {
        this.provider = provider;
    }

    public String pay(PaymentRequest request) throws PaymentException {
        processedCount++;
        return provider + ":" + request.orderId();
    }

    private String internalStatus() {
        return provider + ":" + processedCount;
    }
}
~~~

Một framework thường không bắt đầu bằng `Method.invoke(...)`. Nó phải giải quyết ba câu hỏi trước: **method nào**, **chữ ký nào**, và **đối tượng nhận/đối số nào phù hợp**. Lời gọi chỉ là bước cuối.
