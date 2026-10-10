Một lớp có thể `implements` nhiều interface. Ví dụ xuyên suốt có thể kết hợp hợp đồng công khai, phần triển khai dùng chung và một khả năng độc lập:

```java
interface Refundable {
    void refund(int amount);
}

class CardPayment extends BasePayment
        implements PaymentMethod, Refundable {

    @Override
    public void pay(int amount) { ... }

    @Override
    public void refund(int amount) { ... }
}
```

Điều này cho phép một đối tượng đảm nhận nhiều vai trò mà không cần đa kế thừa lớp.

Các yêu cầu abstract tương thích từ nhiều interface có thể được thỏa bởi cùng một phương thức triển khai. Nếu nhiều phương thức `default` cạnh tranh nhau, Java có các quy tắc giải quyết riêng; phần đó được học sau khi ta hiểu kế thừa interface và các loại phương thức interface.

### MỐI LIÊN HỆ

Ta đã có hai công cụ có thể cùng tham gia mô tả hợp đồng: lớp trừu tượng và interface. Bước tiếp theo đặt chúng cạnh nhau để trả lời câu hỏi quan trọng: **khi nào nên chọn cơ chế nào?**
