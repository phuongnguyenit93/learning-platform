Reflection có thêm chi phí thực thi, nhưng câu “Reflection luôn chậm” quá đơn giản để dùng làm quy tắc thiết kế.

Chi phí có thể nằm ở nhiều nơi:

- tra cứu lặp lại như `getDeclaredMethod()` hoặc quét toàn bộ thành phần;
- phân tích và phân giải siêu dữ liệu annotation/generic;
- kiểm tra quyền truy cập;
- đóng gói đối số, unboxing/widening và boxing giá trị trả về;
- phân phối lời gọi phản chiếu khó tối ưu giống một điểm gọi trực tiếp trong một số đường chạy nóng.

Java hiện đại đã tối ưu Core Reflection đáng kể, nên không nên dựa vào benchmark cũ hoặc các chi tiết phần triển khai lịch sử để kết luận. Cách thực tế là **không lặp việc khám phá siêu dữ liệu vô ích**.

```java
final class PaymentInvoker {
    private final Method pay;

    PaymentInvoker() throws NoSuchMethodException {
        this.pay = PaymentService.class.getMethod("pay", PaymentRequest.class);
    }

    Method method() {
        return pay;
    }
}
```

Framework thường phân giải siêu dữ liệu khi khởi động, đăng ký hoặc lần dùng đầu tiên, sau đó lưu đệm đối tượng mô tả/kế hoạch đã được kiểm tra. Lưu đệm giảm tra cứu/phân tích lặp lại; nó không xóa chi phí chuyển đổi đối số, phân phối lời gọi động hay chi phí bảo trì.

Nếu Reflection nằm trong vòng lặp nóng và hiệu năng thực sự quan trọng, hãy đo bằng benchmark/profiler trên tải công việc thật. Khi đối tượng đích đã được phân giải và được gọi rất nhiều lần, `MethodHandle` hoặc mã sinh tự động có thể đáng cân nhắc, nhưng lựa chọn phải dựa trên mô hình của trường hợp sử dụng chứ không phải khẩu hiệu “Reflection chậm”.
