Varargs dễ gây nhầm vì có **hai lớp varargs**: method đích có thể là varargs, đồng thời `Method.invoke(...)` bản thân cũng nhận `Object... args`.

Ví dụ:

~~~java
public String summarize(String prefix, String... values) {
    return prefix + ":" + String.join(",", values);
}
~~~

Reflection nhìn chữ ký method đích như một method có tham số cuối là mảng:

~~~java
Method method = PaymentService.class.getMethod(
        "summarize",
        String.class,
        String[].class
);

System.out.println(method.isVarArgs()); // true
~~~

Khi invoke, bên gọi phải cung cấp array đúng ở vị trí cuối:

~~~java
Object result = method.invoke(
        service,
        "payments",
        new String[] {"A", "B"}
);
~~~

Reflection không tự thực hiện việc đóng gói varargs cho method đích giống cú pháp gọi method thông thường. Với method đích chỉ có một tham số `String...`:

~~~java
public String join(String... values) { ... }
~~~

nên làm rõ `String[]` là **một đối số phản chiếu duy nhất**:

~~~java
Method join = PaymentService.class.getMethod(
        "join",
        String[].class
);

join.invoke(service, (Object) new String[] {"A", "B"});
~~~

Ép sang `Object` ngăn trình biên dịch Java hiểu `String[]` như chính `Object...` của `Method.invoke` và bung nó thành nhiều đối số phản chiếu.

Khi viết hàm tiện ích gọi Reflection, hãy dùng `isVarArgs()` như siêu dữ liệu để chuẩn hóa đối số theo quy tắc của chính hàm đó, thay vì giả định `Method.invoke` sẽ thay trình biên dịch xử lý mọi trường hợp varargs.

Sau lời gọi Method, thao tác còn lại để hoàn tất vòng đời đối tượng là **Constructor**: nếu class cụ thể chỉ được biết lúc chạy, đối tượng ban đầu được tạo thế nào?
