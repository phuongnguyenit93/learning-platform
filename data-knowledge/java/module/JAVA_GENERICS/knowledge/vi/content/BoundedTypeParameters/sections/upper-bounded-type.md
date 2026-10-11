```java
static <T extends Number> double twice(T value) {
    return value.doubleValue() * 2;
}
```

`T extends Number` nghĩa là đối số kiểu phải là `Number` hoặc một kiểu con (subtype) của nó.

```java
twice(10);     // Integer
twice(2.5);    // Double
// twice("10"); // compile error
```

Từ khóa vẫn là `extends` ngay cả khi giới hạn là một giao diện (`interface`):

```java
static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}
```

Bound vừa giới hạn bên gọi, vừa mở ra các khả năng an toàn cho phần triển khai.

Khai báo type parameter chỉ hỗ trợ **giới hạn trên (upper bound)** bằng `extends`:

```java
<T extends Number> // hợp lệ
// <T super Integer> // không hợp lệ
```

Nếu cần diễn tả “một kiểu cha (supertype) nào đó của `Integer`”, Java dùng **wildcard giới hạn dưới (lower-bounded wildcard)** `? super Integer` ở nơi sử dụng; chương Wildcard/PECS sẽ học phần đó.
