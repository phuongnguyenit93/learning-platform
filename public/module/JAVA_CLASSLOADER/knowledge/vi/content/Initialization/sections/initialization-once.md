Với một `Class<?>` cụ thể khi chạy, JVM đảm bảo quy trình khởi tạo chỉ hoàn thành một lần.

```java
final class PluginRegistry {
    static {
        System.out.println("INIT");
    }

    static void touch() {
    }
}

public class Demo {
    public static void main(String[] args) {
        PluginRegistry.touch();
        PluginRegistry.touch();
        PluginRegistry.touch();
    }
}
```

Kết quả:

```text
INIT
```

nhưng `touch()` được gọi ba lần.

Kết nối với phần Định danh class:

```text
PaymentPlugin do loaderA định nghĩa
→ đối tượng Class A
→ trạng thái khởi tạo A

PaymentPlugin do loaderB định nghĩa
→ đối tượng Class B
→ trạng thái khởi tạo B
```

Vì hai ClassLoader định nghĩa tạo ra hai định danh class khác nhau khi chạy, mỗi định danh có trạng thái khởi tạo riêng. “Static singleton” vì vậy chỉ mang tính singleton **trong phạm vi một định danh class khi chạy**, không phải singleton toàn JVM khi có nhiều ClassLoader.
