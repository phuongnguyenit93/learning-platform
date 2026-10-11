Khi viết:

```java
Box<String> box = new Box<>();
```

phần `<String>` bên trái nói rõ biến có kiểu `Box<String>`. Ở phía `new Box<>()`, cặp `<>` rỗng được gọi không chính thức là **diamond operator**.

Compiler suy luận **đối số kiểu của lớp generic đang được khởi tạo** từ ngữ cảnh:

```java
Box<String> box = new Box<>();
// tương đương về type với:
Box<String> other = new Box<String>();
```

Diamond không có nghĩa “raw type”, và cũng không phải type parameter riêng của một generic constructor. Hai dòng sau khác nhau:

```java
Box<String> safe = new Box<>(); // generic, compiler suy luận String
Box<String> risky = new Box();  // raw Box -> unchecked conversion warning
```

Với người mới học, quy tắc thực tế rất đơn giản: nếu compiler suy luận được type argument khi tạo đối tượng generic, ưu tiên `<>` thay vì lặp lại type argument.

### Khi chỉ một phương thức cần generic

`Box<T>` cần type parameter vì **cả đối tượng** làm việc với cùng một kiểu `T`. Nhưng có nhiều trường hợp lớp hoàn toàn không cần generic; chỉ **một phương thức** có cùng cách xử lý cho nhiều kiểu dữ liệu.

Ví dụ nếu không có phương thức generic, ta có thể bị kéo tới các phương thức lặp:

```java
static String echoString(String value) { return value; }
static Integer echoInteger(Integer value) { return value; }
```

Cách xử lý không đổi; chỉ kiểu dữ liệu đổi. Không có lý do để biến cả lớp tiện ích thành `Util<T>` chỉ vì một thao tác như vậy.

**Generic Method** cho phép chính phương thức khai báo “ô kiểu” riêng:

```java
static <T> T echo(T value) {
    return value;
}
```

Một phương thức duy nhất dùng được với `String`, `Integer`, `User`... và compiler vẫn giữ quan hệ: **đưa vào T thì trả về T**.
