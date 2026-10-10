Trong khai báo:

```java
class Box<T> { ... }
```

`T` là **tham số kiểu (type parameter)**: một biến kiểu (type variable) thuộc khai báo `Box`.

Trong:

```java
Box<String> textBox = new Box<>();
Box<Integer> numberBox = new Box<>();
```

`String` và `Integer` là **đối số kiểu (type argument)**.

Có thể có nhiều tham số kiểu:

```java
final class Pair<K, V> {
    private K key;
    private V value;
}
```

Tên thường dùng:

| Tên | Ý nghĩa thường gặp |
| --- | --- |
| `T` | Type |
| `E` | Element |
| `K` | Key |
| `V` | Value |
| `R` | Result |

Đây chỉ là quy ước đặt tên. Compiler không gán ý nghĩa đặc biệt cho các tên này.

Một kiểu được tham số hóa (parameterized type) như `Box<String>` được dùng trong kiểm tra khi biên dịch. Nó không có nghĩa JVM tạo một class bytecode hoàn toàn mới riêng cho mỗi type argument; phần đó sẽ được giải thích ở chương Type Erasure.

Chương tiếp theo chuyển từ **“Generics là gì?”** sang **“khai báo và sử dụng kiểu generic/phương thức generic như thế nào?”**.
