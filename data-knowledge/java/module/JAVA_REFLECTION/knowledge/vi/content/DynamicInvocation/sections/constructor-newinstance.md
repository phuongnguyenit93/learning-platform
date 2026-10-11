Khi đã chọn được đối tượng mô tả:

~~~java
Constructor<PaymentService> constructor =
        PaymentService.class.getConstructor(String.class);

PaymentService service = constructor.newInstance("stripe");
~~~

Đây là thao tác tương đương bằng Reflection của:

~~~java
PaymentService service = new PaymentService("stripe");
~~~

Varargs của constructor có cùng ranh giới đã thấy ở `Method.invoke(...)`: Reflection nhìn tham số `String...` như `String[]`, còn `Constructor.newInstance(...)` bản thân cũng nhận `Object...`.

~~~java
class TagBundle {
    TagBundle(String... tags) {}
}

Constructor<TagBundle> tagsConstructor =
        TagBundle.class.getDeclaredConstructor(String[].class);

TagBundle bundle = tagsConstructor.newInstance(
        (Object) new String[] {"fast", "safe"}
);
~~~

Cast sang `Object` làm rõ rằng `String[]` là **một đối số duy nhất của constructor**. Nếu bỏ cast trong trường hợp constructor chỉ nhận một `String...`, mảng có thể bị Java hiểu như chính mảng varargs `Object...` của `newInstance(...)`, làm các phần tử bị bung thành nhiều đối số phản chiếu. Reflection không tự đóng gói varargs cho constructor đích giống cú pháp gọi constructor thông thường.

Điểm khác biệt là constructor có thể được chọn từ siêu dữ liệu lúc chạy:

~~~java
static <T> T create(
        Class<T> type,
        Class<?>[] parameterTypes,
        Object[] arguments
) throws ReflectiveOperationException {
    Constructor<T> constructor =
            type.getDeclaredConstructor(parameterTypes);
    return constructor.newInstance(arguments);
}
~~~

Trong framework thật, trước khi `newInstance(...)` thường có bước kiểm tra chính sách chọn constructor, quyền truy cập và cách phân giải dependency.

Đối số có thể trải qua chuyển đổi mở hộp/mở rộng primitive phù hợp với lời gọi phản chiếu. Nhưng bên gọi vẫn phải cung cấp số lượng và kiểu đối số hợp lệ; Reflection không tự phân tích hay chuyển đổi giá trị nghiệp vụ tùy ý.

Nên ưu tiên `Constructor.newInstance(...)` thay cho `Class.newInstance()`. `Class.newInstance()` đã deprecated vì hợp đồng kém rõ hơn, chỉ nhắm tới constructor không tham số và xử lý ngoại lệ của constructor theo cách khó dùng an toàn hơn. Đối tượng mô tả `Constructor` biểu diễn chính xác constructor đã chọn và bọc lỗi của mã đích qua `InvocationTargetException` giống `Method.invoke(...)`.

Việc tạo đối tượng bằng Reflection **vẫn chạy constructor thật**. Nó không phải cơ chế cấp phát đối tượng rồi bỏ qua logic khởi tạo:

~~~java
public PaymentService(String provider) {
    if (provider == null || provider.isBlank()) {
        throw new IllegalArgumentException("provider is required");
    }
    this.provider = provider;
}
~~~

`constructor.newInstance("")` sẽ thực thi phần kiểm tra này.
