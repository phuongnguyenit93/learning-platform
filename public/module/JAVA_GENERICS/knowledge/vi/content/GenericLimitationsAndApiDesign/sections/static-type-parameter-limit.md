```java
class Box<T> {
    // static T cached; // compile error
}
```

`static` member chỉ tồn tại một lần cho class, trong khi `Box<String>`, `Box<Integer>`... không tạo các class runtime riêng có trạng thái static riêng cho từng type argument.

Phương thức static vẫn có thể tự generic:

```java
class Box<T> {
    static <U> U identity(U value) {
        return value;
    }
}
```

`U` thuộc phương thức, không thuộc parameterization của `Box`.
