```java
void log(String... messages) {
    System.out.println(messages.length);
}
```

Trong thân phương thức, `messages` có kiểu `String[]`.

Bên gọi có thể viết:

```java
log("a", "b");
```

hoặc truyền một mảng tương thích.

Tham số `varargs` phải là tham số cuối cùng của phương thức.

### Bên gọi được chuyển thành mảng như thế nào?

```java
log();
log("a");
log("a", "b");
```

Trong mô hình tư duy của thân phương thức, ba lời gọi trên tương ứng với việc nhận một `String[]` có độ dài 0, 1 và 2. Bên gọi cũng có thể truyền mảng có sẵn:

```java
String[] messages = {"a", "b"};
log(messages);
```

`varargs` chủ yếu là tiện ích cú pháp ở vị trí gọi; khi thiết kế API vẫn cần hiểu ngữ nghĩa mảng, việc cấp phát và ranh giới thay đổi dữ liệu.

### `null` là trường hợp dễ nhầm

```java
log((String[]) null);
```

Phương thức nhận `messages == null`, khác hoàn toàn với `log()` vốn nhận mảng rỗng. API công khai nên quyết định rõ có chấp nhận mảng `null` hay không.
