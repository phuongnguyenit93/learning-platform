Một field có thể có hai lớp thông tin kiểu:

~~~java
private List<String> supportedCurrencies;
~~~

~~~java
Field field = PaymentService.class
        .getDeclaredField("supportedCurrencies");

Class<?> rawType = field.getType();
Type genericType = field.getGenericType();

System.out.println(rawType);
// interface java.util.List

System.out.println(genericType.getTypeName());
// java.util.List<java.lang.String>
~~~

`getType()` trả `Class<?>` của **kiểu lúc chạy/kiểu thô**. Nó phù hợp cho các câu hỏi như “field này có gán được từ `List` không?”.

`getGenericType()` trả `java.lang.reflect.Type` và có thể giữ siêu dữ liệu từ chữ ký generic. Với `List<String>`, kết quả thường là `ParameterizedType` thay vì chỉ `Class`.

~~~java
if (genericType instanceof ParameterizedType parameterized) {
    Type elementType = parameterized.getActualTypeArguments()[0];
    System.out.println(elementType.getTypeName());
}
~~~

Với biến kiểu:

~~~java
class Box<T> {
    T value;
}
~~~

`getType()` của `value` phản ánh kết quả sau xóa kiểu (thường là `Object` nếu `T` không có giới hạn cụ thể), còn `getGenericType()` có thể trả `TypeVariable` đại diện cho `T`.

Điều này không có nghĩa đối tượng generic thực sự giữ mọi đối số kiểu lúc chạy. Java vẫn dùng xóa kiểu (type erasure) cho quá trình thực thi; Reflection đang đọc **siêu dữ liệu chữ ký generic còn được lưu trên khai báo**. `ParameterizedType`, `TypeVariable`, `WildcardType` và `GenericArrayType` sẽ được học đầy đủ ở chương **Siêu dữ liệu Generics còn lại sau xóa kiểu**.

Field reflection vì thế nối hai lớp siêu dữ liệu:

~~~text
Mô hình kiểu lúc chạy
→ cấu trúc kiểu/thành phần

Field
→ đối tượng mô tả trạng thái + siêu dữ liệu kiểu/modifier/chữ ký

Siêu dữ liệu Generics sau xóa kiểu
→ chữ ký khai báo phong phú hơn khi Class<?> dạng thô không đủ
~~~

Sau khi biết cách tìm và mô tả trạng thái, bước tiếp theo của milestone **Khám phá các thành phần của lớp** là hành vi: **làm sao tìm đúng `Method` và hiểu chữ ký của nó trước khi thực hiện lời gọi?**
