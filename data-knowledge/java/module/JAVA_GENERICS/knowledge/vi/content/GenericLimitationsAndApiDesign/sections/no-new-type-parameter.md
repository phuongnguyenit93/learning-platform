Không hợp lệ:

```java
static <T> T create() {
    // return new T();
}
```

Sau erasure, `T` không mang một class cụ thể đủ để JVM thực hiện `new T()`. Ngoài ra, khai báo `<T>` cũng không hề yêu cầu type argument phải có một constructor cụ thể.

Mã generic phải nhận **chiến lược tạo object từ bên ngoài** thay vì tự đoán constructor. Ta có thể diễn tả ý tưởng chỉ bằng những kiến thức đã học:

```java
interface Factory<T> {
    T create();
}

static <T> T create(Factory<T> factory) {
    return factory.create();
}
```

Bên gọi quyết định cách tạo `T`; phương thức generic chỉ giữ quan hệ kiểu. Những cách ngắn hơn bằng lambda hoặc cách dựa vào `Class<T>`/Reflection thuộc các module sau.
