Phương thức `static` không gắn với một đối tượng cụ thể, nhưng nó hoàn toàn có thể generic nếu **phương thức tự khai báo type parameter**:

```java
final class Boxes {
    static <T> Box<T> of(T value) {
        Box<T> box = new Box<>();
        box.set(value);
        return box;
    }
}
```

Điểm quan trọng:

```java
class Container<T> {
    // static T value;              // không hợp lệ
    static <U> U identity(U value) { // hợp lệ
        return value;
    }
}
```

`U` thuộc phương thức `static`; nó không phụ thuộc vào type parameter `T` của từng parameterization của `Container`.
