`java.lang.reflect.Type` là interface chung cho các dạng kiểu mà Reflection có thể trả về. Điều quan trọng là đừng mặc định mọi `Type` đều là `Class<?>`.

Các dạng chính gồm:

- `Class<?>`: kiểu được JVM biểu diễn trực tiếp bằng `Class`, ví dụ `String`, raw `List`, `int`, `String[]`;
- `ParameterizedType`: kiểu có đối số kiểu cụ thể trong khai báo, ví dụ `List<String>`;
- `TypeVariable<?>`: biến kiểu như `T` trong `Repository<T>`;
- `WildcardType`: wildcard như `? extends T` hoặc `? super Integer`;
- `GenericArrayType`: mảng có kiểu phần tử là cấu trúc generic không thể biểu diễn chỉ bằng một `Class<?>`, ví dụ `T[]`.

Ví dụ:

```java
for (Field field : Repository.class.getDeclaredFields()) {
    Type raw = field.getType();
    Type generic = field.getGenericType();

    System.out.println(field.getName());
    System.out.println("raw     = " + raw.getTypeName());
    System.out.println("generic = " + generic.getTypeName());
}
```

Với `values`, `getType()` trả `List.class`, còn `getGenericType()` trả siêu dữ liệu tương ứng `List<? extends T>`. Với `buffer`, kiểu thô sau xóa kiểu là `Number[]`, trong khi siêu dữ liệu generic mô tả `T[]` dưới dạng `GenericArrayType`.

Đây là lý do API Reflection cho generic trả `Type`: một `Class<?>` không đủ để biểu diễn cấu trúc generic lồng nhau.
