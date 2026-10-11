Đối tượng mô tả `Method` chứa nhiều hơn tên:

~~~java
Method method = PaymentService.class.getMethod(
        "pay",
        PaymentRequest.class
);

String name = method.getName();
Class<?> declaringClass = method.getDeclaringClass();
Class<?> returnType = method.getReturnType();
Class<?>[] parameterTypes = method.getParameterTypes();
Class<?>[] exceptionTypes = method.getExceptionTypes();
int modifiers = method.getModifiers();
~~~

`getDeclaringClass()` trả class/interface **thực sự khai báo method đó**. Điều này khác với class mà framework bắt đầu tra cứu: `PaymentService.class.getMethod(...)` có thể trả một public method được kế thừa từ superclass/interface, và khi đó class khai báo không nhất thiết là `PaymentService`.

Với `pay(...)`, framework có thể kiểm tra hợp đồng trước khi gọi:

~~~java
if (method.getReturnType() != String.class) {
    throw new IllegalStateException("pay must return String");
}

if (!Modifier.isPublic(method.getModifiers())) {
    throw new IllegalStateException("pay must be public");
}
~~~

Chữ ký generic có nhóm API riêng:

~~~java
method.getGenericReturnType();
method.getGenericParameterTypes();
method.getGenericExceptionTypes();
~~~

Các API này trả `Type` thay vì chỉ `Class<?>` và sẽ được đào sâu ở chương **Siêu dữ liệu Generics còn lại sau xóa kiểu**.

Siêu dữ liệu của tham số:

~~~java
for (Parameter parameter : method.getParameters()) {
    System.out.println(parameter.getName());
    System.out.println(parameter.getType());
}
~~~

Tên tham số ở cấp mã nguồn **không mặc định luôn được giữ**. Khi class không được biên dịch với siêu dữ liệu phù hợp như tùy chọn `-parameters`, Reflection có thể chỉ thấy tên tổng hợp kiểu `arg0`. Framework không nên dựa vào tên tham số nếu hợp đồng build không đảm bảo nó tồn tại.

Method còn cung cấp các đặc tính hữu ích:

~~~java
method.isVarArgs();
method.isDefault();
method.isBridge();
method.isSynthetic();
~~~

`isDefault()` hữu ích với default method của interface. `isBridge()`/`isSynthetic()` cảnh báo rằng method có thể là phần tử do trình biên dịch tạo thay vì khai báo mà người viết mã nguồn trực tiếp tạo.

Sau Field và Method, phần khám phá còn thiếu là **Constructor**: lúc chạy có những constructor nào, tham số/ngoại lệ/modifier của chúng ra sao, và framework chọn đối tượng mô tả nào trước khi tạo đối tượng?
