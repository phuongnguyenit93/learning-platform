Hai nhóm lỗi phổ biến:

```text
symbolic member không tồn tại / sai descriptor
→ NoSuchMethodException
→ NoSuchFieldException

member tồn tại nhưng Lookup không có quyền
→ IllegalAccessException
```

Ví dụ một lỗi dễ gặp:

```java
lookup.findVirtual(
        Greeter.class,
        "greet",
        MethodType.methodType(
                String.class,
                Object.class // sai parameter type
        )
);
```

MethodHandle lookup yêu cầu symbolic signature chính xác của member đích; nó không tự “search overload gần nhất”.

Khi debug access:

1. kiểm tra lookup class/modes;
2. kiểm tra visibility của declaring class và member;
3. kiểm tra package/module readability/openness;
4. kiểm tra chính xác `MethodType`;
5. chỉ sau đó mới xem adaptation của handle.
