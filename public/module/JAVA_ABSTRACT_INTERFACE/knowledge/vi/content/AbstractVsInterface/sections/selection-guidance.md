Một nguyên tắc kinh nghiệm hữu ích:

| Nhu cầu | Thường phù hợp hơn |
| --- | --- |
| giữ trạng thái và quy tắc khởi tạo dùng chung | abstract class |
| cung cấp phần triển khai nền tảng gắn với một họ lớp | abstract class |
| mô tả vai trò/khả năng | interface |
| nhiều lớp không liên quan cùng thực hiện một hợp đồng | interface |
| một lớp cần đảm nhận nhiều vai trò | interface |
| cần cả hợp đồng linh hoạt và phần triển khai dùng chung | interface + lớp cha trừu tượng |

Hai cơ chế hoàn toàn có thể dùng cùng nhau:

```java
interface PaymentMethod {
    void pay(int amount);
}

abstract class BasePayment implements PaymentMethod {
    private final String provider;

    protected BasePayment(String provider) {
        this.provider = provider;
    }
}

class CardPayment extends BasePayment implements Refundable {
    ...
}
```

Interface giữ hợp đồng mà bên sử dụng phụ thuộc; lớp trừu tượng cung cấp phần triển khai chung cho một nhánh cụ thể. Một lớp khác vẫn có thể triển khai `PaymentMethod` mà không cần kế thừa `BasePayment`.

Sau khi biết cách chọn hai cơ chế cơ bản, bước tiếp theo là xem **bản thân các interface có thể kế thừa và kết hợp hợp đồng của nhau như thế nào**.
