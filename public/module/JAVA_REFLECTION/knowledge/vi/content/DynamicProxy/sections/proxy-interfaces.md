JDK Dynamic Proxy tạo phần triển khai cho interface; nó không tạo subclass của class đích cụ thể. Do đó:

```java
proxy instanceof PaymentGateway     // true
proxy instanceof PaymentGatewayImpl // false
```

Bên gọi nên giữ tham chiếu bằng kiểu interface. Nếu API bên ngoài yêu cầu class triển khai cụ thể, JDK Proxy không thể giả làm class đó.

Một proxy có thể triển khai nhiều interface:

```java
Object proxy = Proxy.newProxyInstance(
        loader,
        new Class<?>[] { PaymentGateway.class, Auditable.class },
        handler
);
```

Các interface phải nhìn thấy được từ class loader dùng để tạo proxy và phải thỏa các ràng buộc của `Proxy` API. Trên Java 21, interface đưa vào JDK Proxy **không được là hidden interface hoặc sealed interface**. Interface không public còn bị giới hạn chặt hơn về package/mô-đun; đây là một lý do framework thường proxy interface nghiệp vụ public.

Nếu nhiều interface có method cùng chữ ký, handler vẫn nhận `Method` theo quy tắc lựa chọn của JDK Proxy. Không nên thiết kế handler dựa vào giả định “interface khai báo luôn chính xác là interface mà bên gọi đã ép kiểu tới” khi chữ ký bị trùng giữa nhiều proxy interface.

Default method của interface cũng đi qua handler. Nếu handler muốn gọi đúng phần triển khai mặc định thay vì ủy quyền theo cách khác, Java cung cấp `InvocationHandler.invokeDefault(...)` cho trường hợp đó.
