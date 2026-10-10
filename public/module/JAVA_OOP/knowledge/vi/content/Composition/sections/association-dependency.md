Một dependency có thể chỉ tồn tại trong một thao tác:

```java
Receipt checkout(PaymentGateway gateway) {
    return gateway.charge(...);
}
```

`PaymentGateway` được truyền vào để dùng cho lời gọi hiện tại.

Nếu một đối tượng cộng tác là phần ổn định của trạng thái đối tượng, trường thường phù hợp hơn:

```java
class CheckoutService {
    private final PaymentGateway gateway;
}
```

Trong trường hợp này, `CheckoutService` giữ quan hệ lâu dài hơn với `PaymentGateway`.

Một đối tượng cộng tác lưu trong trường cũng chưa chắc bị sở hữu mạnh. Hai service hoàn toàn có thể giữ tham chiếu tới cùng một đối tượng có thể thay đổi. Khi đó cần suy nghĩ thêm về dùng chung tham chiếu, thay đổi trạng thái dùng chung và hợp đồng vòng đời thay vì chỉ nhìn cú pháp trường/tham chiếu.

### ĐÁNH ĐỔI — không cần gắn nhãn cho mọi tham chiếu

Không cần ép mọi tham số thành “dependency” và mọi trường thành “association” nếu việc phân loại không giúp ích cho thiết kế.

Mục tiêu là hiểu **mức phụ thuộc và vòng đời**, không phải gắn thuật ngữ UML cho mọi đối tượng.
