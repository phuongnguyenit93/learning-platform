`Constructor<?>` có siêu dữ liệu gần với Method nhưng không có kiểu trả về:

~~~java
Constructor<PaymentService> constructor =
        PaymentService.class.getConstructor(String.class);

Class<PaymentService> owner = constructor.getDeclaringClass();
Class<?>[] parameterTypes = constructor.getParameterTypes();
Type[] genericParameterTypes = constructor.getGenericParameterTypes();
Class<?>[] exceptionTypes = constructor.getExceptionTypes();
int modifiers = constructor.getModifiers();
boolean varArgs = constructor.isVarArgs();
boolean synthetic = constructor.isSynthetic();
~~~

Siêu dữ liệu tham số cũng có thể đọc qua `getParameters()`:

~~~java
for (Parameter parameter : constructor.getParameters()) {
    System.out.println(parameter.getName());
    System.out.println(parameter.getType());
}
~~~

Giống tham số của method, tên ở cấp mã nguồn chỉ đáng tin khi quá trình biên dịch giữ siêu dữ liệu tên tham số; nếu không, lúc chạy có thể chỉ thấy `arg0`, `arg1`...

Framework có thể dùng siêu dữ liệu để xây quy tắc chọn constructor:

~~~java
static boolean acceptsProvider(Constructor<?> constructor) {
    return Arrays.equals(
            constructor.getParameterTypes(),
            new Class<?>[] {String.class}
    );
}
~~~

Constructor có thể khai báo checked exception:

~~~java
public PaymentService(String provider)
        throws ConfigurationException {
    // ...
}
~~~

`getExceptionTypes()` cho phép công cụ thấy khai báo đó. Nếu ngoại lệ thực sự bị ném khi `newInstance(...)`, nó sẽ xuất hiện như nguyên nhân (`cause`) của `InvocationTargetException`.

Varargs constructor cũng được Reflection biểu diễn bằng mảng ở tham số cuối và `isVarArgs() == true`. Đến đây người học đã hoàn thành **việc khám phá** `Field`, `Method` và `Constructor`; chương tiếp theo dùng chính các đối tượng mô tả đó để đọc/ghi field, gọi method và tạo đối tượng lúc chạy.
