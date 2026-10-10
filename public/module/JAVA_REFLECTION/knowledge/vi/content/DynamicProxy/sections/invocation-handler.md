`InvocationHandler` có một method trung tâm:

```java
Object invoke(Object proxy, Method method, Object[] args) throws Throwable;
```

`method` mô tả thao tác mà bên gọi vừa gọi; `args` chứa các đối số; `proxy` là chính instance proxy. Với method không có tham số, JDK có thể truyền `args == null`, vì vậy handler tổng quát không nên mặc định `args.length` luôn dùng được. Handler có thể ghi log, kiểm tra quyền, đo thời gian, định tuyến tới điểm cuối từ xa hoặc ủy quyền tới đối tượng thật.

Một handler tối giản cho ví dụ thanh toán:

```java
final class LoggingHandler implements InvocationHandler {
    private final PaymentGateway target;

    LoggingHandler(PaymentGateway target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if (method.getDeclaringClass() == Object.class) {
            return handleObjectMethod(proxy, method, args);
        }

        System.out.println("before " + method.getName());

        try {
            Object result = method.invoke(target, args);
            System.out.println("after " + method.getName());
            return result;
        } catch (InvocationTargetException ex) {
            throw ex.getCause();
        }
    }

    private Object handleObjectMethod(Object proxy, Method method, Object[] args) {
        return switch (method.getName()) {
            case "toString" -> "PaymentGatewayProxy[" + target + "]";
            case "hashCode" -> System.identityHashCode(proxy);
            case "equals" -> proxy == args[0];
            default -> throw new UnsupportedOperationException(method.toString());
        };
    }
}
```

Việc lấy ngoại lệ gốc từ `InvocationTargetException` khi ủy quyền bằng `Method.invoke()` rất quan trọng. Nếu method đích `pay()` ném ngoại lệ nghiệp vụ, handler thường muốn truyền tiếp nguyên nhân thật theo hợp đồng của interface thay vì để lớp bọc của Reflection trở thành lỗi chính.

Ngoại lệ từ handler cũng phải phù hợp với hợp đồng của method mà proxy đang triển khai. `RuntimeException` và `Error` có thể đi qua trực tiếp; checked exception nên nằm trong `throws` của interface method tương ứng. Nếu handler ném một checked exception không được hợp đồng của method khai báo, bên gọi proxy có thể nhận `UndeclaredThrowableException` bọc ngoại lệ đó.

Handler cũng không bắt buộc phải ủy quyền tới một đối tượng cục bộ. Một HTTP/RPC client proxy có thể đọc `Method` + annotation rồi mã hóa yêu cầu gửi qua mạng. Điều cốt lõi là proxy biến một **lời gọi interface có kiểu rõ ràng** thành một **sự kiện chặn lời gọi ở lúc chạy**.
