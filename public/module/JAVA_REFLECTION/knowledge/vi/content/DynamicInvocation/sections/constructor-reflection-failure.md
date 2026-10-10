Việc gọi constructor bằng Reflection có nhiều giai đoạn có thể phát sinh lỗi. Tách chúng ra giúp framework báo đúng nguyên nhân thay vì gom tất cả thành “Reflection thất bại”.

| Lỗi | Ý nghĩa |
| --- | --- |
| NoSuchMethodException | Không tìm thấy constructor đúng kiểu tham số |
| IllegalAccessException | Constructor tồn tại nhưng quyền truy cập phản chiếu không được phép |
| InstantiationException | Class khai báo không thể được tạo instance theo hợp đồng, ví dụ abstract class |
| IllegalArgumentException | Sai số lượng/kiểu đối số, hoặc class đích thuộc trường hợp Reflection cấm tạo instance như enum |
| InvocationTargetException | Thân constructor đã chạy và ném ngoại lệ |
| ExceptionInInitializerError | Quá trình khởi tạo class được kích hoạt và phần khởi tạo tĩnh thất bại |

Ví dụ phân biệt lỗi giao thức Reflection với lỗi nghiệp vụ:

~~~java
Constructor<PaymentService> constructor =
        PaymentService.class.getConstructor(String.class);

try {
    PaymentService service = constructor.newInstance("");
} catch (InvocationTargetException ex) {
    Throwable constructorFailure = ex.getCause();
    // Ví dụ: IllegalArgumentException("provider is required")
}
~~~

Nếu bên gọi truyền Integer thay vì String:

~~~java
constructor.newInstance(123);
~~~

thì lỗi nằm ở hợp đồng của lời gọi phản chiếu, không phải thân constructor.

Enum là trường hợp đặc biệt: instance enum do JVM quản lý theo khai báo; `Constructor.newInstance` không cho phép tạo thêm hằng enum.

Constructor private/package-private vẫn có thể được **khám phá** qua `getDeclaredConstructor(...)`, nhưng tìm thấy không đồng nghĩa được phép gọi. Việc có thể mở quyền truy cập phản chiếu hay không phụ thuộc ranh giới ngôn ngữ/mô-đun và chính sách lúc chạy. Chương **Quyền truy cập, đóng gói và giới hạn mô-đun** sẽ tiếp nối trực tiếp từ đây.

Đến đây ta đã có đủ **ba thao tác cốt lõi** của milestone này:

~~~text
đối tượng mô tả đã được khám phá
    ↓
Field.get/set
Method.invoke
Constructor.newInstance
    ↓
kiểm tra đối tượng nhận / đối số / chuyển đổi / lỗi từ mã đích
    ↓
gặp ranh giới quyền truy cập
~~~

Trước khi chuyển sang ranh giới quyền truy cập, cần tổng hợp rõ **luồng gọi phản chiếu** và các bước kiểm tra mà lời gọi động phải đi qua.
