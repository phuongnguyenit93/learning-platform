```text
PaymentMethod
→ hợp đồng công khai mà checkout(...) phụ thuộc

BasePayment
→ lớp trừu tượng cho một nhánh triển khai cần trạng thái `provider`, kiểm tra hợp lệ và hành vi nền

CardPayment
→ lớp cụ thể hoàn thiện hành vi thanh toán

Refundable
→ khả năng độc lập có thể gắn vào CardPayment hoặc các kiểu khác
```

Ví dụ hoàn chỉnh:

```java
interface PaymentMethod {
    void pay(int amount);

    default String label() {
        return "payment";
    }
}

interface Refundable {
    void refund(int amount);
}

abstract class BasePayment implements PaymentMethod {
    private final String provider;

    protected BasePayment(String provider) {
        this.provider = provider;
    }

    protected String provider() {
        return provider;
    }
}

class CardPayment extends BasePayment implements Refundable {
    CardPayment() {
        super("card");
    }

    @Override
    public void pay(int amount) { ... }

    @Override
    public void refund(int amount) { ... }
}
```

Không có cơ chế nào trong ví dụ “thay thế” cơ chế còn lại. Mỗi cơ chế chịu một trách nhiệm khác nhau.
