Đây là **phần nâng cao về cách compiler triển khai Generics**. Không cần nhớ cách bridge method được sinh để sử dụng Generics hằng ngày; cần hiểu nó khi đọc bytecode/Reflection hoặc giải thích vì sao đa hình (polymorphism) vẫn đúng sau erasure.

Erasure có thể làm chữ ký lúc chạy của phương thức override không còn khớp trực tiếp. Compiler tạo **synthetic bridge method** để giữ hành vi đa hình.

```java
interface Mapper<T> {
    T map(T value);
}

class StringMapper implements Mapper<String> {
    @Override
    public String map(String value) {
        return value.trim();
    }
}
```

Sau erasure, phương thức của interface ở mức runtime gần với:

```java
Object map(Object value)
```

Trong khi phương thức triển khai thật là:

```java
String map(String value)
```

Ở mức khái niệm, compiler có thể sinh bridge method như:

```java
public Object map(Object value) {
    return map((String) value);
}
```

Reflection có thể quan sát phương thức synthetic/bridge này. Nó không phải phương thức do lập trình viên tự viết.
