`ParameterizedType` biểu diễn một khai báo như `List<String>`, `Map<String, PaymentRequest>` hoặc `List<? extends T>`.

```java
Field field = Repository.class.getDeclaredField("values");
Type type = field.getGenericType();

if (type instanceof ParameterizedType parameterized) {
    System.out.println(parameterized.getRawType());

    for (Type argument : parameterized.getActualTypeArguments()) {
        System.out.println(argument.getTypeName());
    }
}
```

Ở đây:

```text
kiểu thô        → java.util.List
đối số thực tế  → ? extends T
```

`getActualTypeArguments()` có thể trả tiếp một `Class`, `ParameterizedType`, `TypeVariable`, `WildcardType` hoặc cấu trúc kiểu khác. Vì vậy mã framework thường phải duyệt `Type` như một cây, thay vì ép thẳng mọi đối số về `Class<?>`.

`ParameterizedType` còn có `getOwnerType()` cho trường hợp kiểu lồng nhau/thành phần có kiểu sở hữu (owner) được tham số hóa. Nó không phải phần chính của ví dụ này, nhưng nhắc ta rằng chữ ký generic có thể là cấu trúc nhiều tầng.
