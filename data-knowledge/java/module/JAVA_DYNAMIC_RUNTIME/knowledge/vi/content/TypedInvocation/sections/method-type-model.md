`MethodType` là value object bất biến mô tả **kiểu trả về + danh sách kiểu tham số** của một lời gọi. Nó không chứa tên method, receiver hay phần triển khai.

```java
MethodType type =
        MethodType.methodType(
                String.class,
                String.class
        );
```

Mental model:

```text
(String)String
   │       └── return type
   └────────── parameter types
```

Một `MethodHandle` luôn có `type()`. Bên gọi cũng có một symbolic method type tại call site. JVM dùng hai phía này để quyết định lời gọi có hợp lệ hay cần adaptation.

`MethodType` cũng là cầu nối với JVM descriptor. Ví dụ method descriptor:

```text
(Ljava/lang/String;)Ljava/lang/String;
```

Không cần học constant pool chi tiết ở đây; chỉ cần hiểu MethodType là biểu diễn cấp Java của hợp đồng lời gọi mà MethodHandle và invokedynamic cùng sử dụng.
