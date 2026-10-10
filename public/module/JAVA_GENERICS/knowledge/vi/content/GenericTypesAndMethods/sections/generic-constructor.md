Hàm tạo cũng có thể tự khai báo type parameter, kể cả khi lớp không generic:

```java
class Message {
    <T> Message(T source) {
        System.out.println(source);
    }
}
```

`T` ở đây thuộc **hàm tạo**, không thuộc lớp `Message`.

Khi gọi:

```java
new Message("java"); // T được suy luận là String
new Message(123);    // T được suy luận là Integer
```

Bên gọi thường không phải ghi type argument tường minh cho hàm tạo; compiler suy luận từ đối số.

Lớp generic cũng có thể có hàm tạo với một type parameter độc lập:

```java
class Box<T> {
    <U> Box(U initialMetadata) {
        // T thuộc lớp, U thuộc hàm tạo
    }
}
```

Đây không phải mẫu cần dùng thường xuyên. Điểm cần hiểu là phạm vi của type parameter phụ thuộc nơi nó được khai báo: lớp/giao diện, hàm tạo hoặc phương thức có thể có type parameter riêng.
