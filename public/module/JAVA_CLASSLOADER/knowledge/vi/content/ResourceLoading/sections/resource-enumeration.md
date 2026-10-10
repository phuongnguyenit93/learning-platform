`getResource` trả một result phù hợp theo lookup order của loader. Nhưng với metadata kiểu SPI hoặc config fragment, classpath có thể chứa nhiều resource cùng tên.

Ví dụ:

```text
library-a.jar!/META-INF/services/com.example.api.Plugin
library-b.jar!/META-INF/services/com.example.api.Plugin
```

Khi cần tất cả:

```java
import java.net.URL;
import java.util.Enumeration;

Enumeration<URL> resources =
        loader.getResources("META-INF/services/com.example.api.Plugin");

while (resources.hasMoreElements()) {
    System.out.println(resources.nextElement());
}
```

Đừng thay `getResources` bằng việc gọi `getResource` rồi giả định chỉ có một file. Service/provider style metadata thường dựa chính vào khả năng aggregate nhiều resource.

Thứ tự tìm kiếm có thể phụ thuộc vào cách triển khai loader và chiến lược delegation. Nếu hành vi nghiệp vụ phụ thuộc vào thứ tự resource, hợp đồng đó phải được thiết kế rõ ràng thay vì vô tình phụ thuộc vào thứ tự classpath.
