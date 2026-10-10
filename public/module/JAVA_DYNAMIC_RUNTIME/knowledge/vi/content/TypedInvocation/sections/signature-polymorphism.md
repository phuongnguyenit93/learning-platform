Trong Java API, `MethodHandle.invokeExact` và `invoke` được biểu diễn tĩnh bằng tham số varargs `Object...` và kiểu trả về `Object`, nhưng JVM không xử lý chúng như varargs method bình thường. Đây là **signature-polymorphic methods**: descriptor thực tế của lời gọi được lấy từ static types xuất hiện tại call site.

Ví dụ:

```java
MethodHandle handle = ...; // (Greeter,String)String

String value =
        (String) handle.invokeExact(
                greeter,
                "Phuong"
        );
```

Cast `(String)` không chỉ để “ép Object”. Nó góp phần xác định expected return type của call-site descriptor.

Điểm này rất quan trọng khi debug: hai dòng trông gần giống nhau trong source có thể tạo call-site descriptors khác nhau chỉ vì static type hoặc cast khác.
