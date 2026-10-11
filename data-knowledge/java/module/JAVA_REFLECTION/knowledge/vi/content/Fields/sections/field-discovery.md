`Class` cung cấp hai nhóm API theo đúng sự phân biệt ở chương trước:

~~~java
Class<PaymentService> type = PaymentService.class;

Field privateField = type.getDeclaredField("processedCount");
Field publicField = type.getField("CHANNEL");
~~~

`getDeclaredField(name)` chỉ tìm field được khai báo trực tiếp trên class hiện tại, bất kể mức truy cập. `getField(name)` chỉ tìm public field và có thể đi lên hệ phân cấp để tìm public field được kế thừa.

Ví dụ:

~~~java
class BaseService {
    public String region = "VN";
}

class PaymentService extends BaseService {
    private int processedCount = 3;
}
~~~

~~~text
PaymentService.class.getDeclaredField("processedCount")
→ tìm thấy

PaymentService.class.getField("region")
→ tìm thấy public field được kế thừa từ BaseService

PaymentService.class.getDeclaredField("region")
→ NoSuchFieldException

PaymentService.class.getField("processedCount")
→ NoSuchFieldException vì field không public
~~~

Khi cần liệt kê:

~~~java
Field[] declared = PaymentService.class.getDeclaredFields();
Field[] publicSurface = PaymentService.class.getFields();
~~~

Thứ tự phần tử không nên được dùng như hợp đồng. Nếu framework cần thứ tự ổn định, nó phải định nghĩa quy tắc riêng, ví dụ sắp xếp theo tên hoặc đọc một siêu dữ liệu khác.

Reflection cũng có thể thấy field synthetic do trình biên dịch tạo. `isSynthetic()` giúp công cụ phân biệt phần tử do trình biên dịch sinh ra với field xuất hiện trực tiếp trong mã nguồn. Một serializer viết kiểu “lấy mọi field khai báo trực tiếp rồi serialize hết” có thể vô tình kéo theo dữ liệu không thuộc hợp đồng của mô hình.

Một cách an toàn hơn là lọc có chủ đích:

~~~java
static List<Field> instanceFields(Class<?> type) {
    return Arrays.stream(type.getDeclaredFields())
            .filter(field -> !field.isSynthetic())
            .filter(field -> !Modifier.isStatic(field.getModifiers()))
            .toList();
}
~~~
