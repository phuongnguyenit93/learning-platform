Reflection mạnh nhất ở mã hạ tầng phải làm việc với **nhiều kiểu do người dùng hoặc phần mở rộng framework định nghĩa**.

Một dependency injection container có thể tìm constructor và tiêm dependency. Một serializer có thể kiểm tra field/thuộc tính để chuyển đối tượng thành JSON. ORM có thể đọc siêu dữ liệu của entity và ánh xạ dữ liệu. Test runner có thể phát hiện method có annotation test. Router/framework có thể đọc siêu dữ liệu rồi đăng ký handler. Các công cụ gỡ lỗi, kiểm tra hợp lệ hoặc ánh xạ đối tượng cũng có cùng mẫu: cấu trúc của đối tượng đích trở thành đầu vào của thuật toán.

Ví dụ một mapper rất nhỏ có thể nhận đối tượng mà không biết class cụ thể:

~~~java
static Map<String, Object> snapshot(Object target) throws IllegalAccessException {
    Map<String, Object> values = new LinkedHashMap<>();

    for (Field field : target.getClass().getDeclaredFields()) {
        if (Modifier.isPublic(field.getModifiers())) {
            values.put(field.getName(), field.get(target));
        }
    }
    return values;
}
~~~

Điều quan trọng là mapper viết **một thuật toán theo siêu dữ liệu**, thay vì một nhánh riêng cho `PaymentService`, `Customer`, `Order`, ...

Reflection không phải lựa chọn duy nhất để mở rộng hệ thống. Interface, factory, registry, `ServiceLoader`, mã được sinh tự động hoặc annotation processing có thể tạo hợp đồng rõ và an toàn hơn. Reflection đáng dùng khi việc khám phá lúc chạy thật sự đem lại giá trị, đặc biệt khi framework không thể yêu cầu mọi mô hình dữ liệu viết adapter bằng tay.
