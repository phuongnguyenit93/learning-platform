Tham chiếu kiểu này có dạng `TypeName::instanceMethod`. Chưa có đối tượng nhận cố định, nên giao diện hàm đích phải cung cấp đối tượng nhận ở tham số đầu tiên, rồi mới tới các đối số của phương thức.

```java
Function<String, String> trim = String::trim;
BiPredicate<String, String> startsWith = String::startsWith;

trim.apply("  Java  ");            // "Java"
startsWith.test("Java", "Ja");   // true
```

Với `String::trim`, đầu vào của `Function` trở thành đối tượng `String` nhận lời gọi. Với `String::startsWith`, đối số đầu của `BiPredicate` là đối tượng nhận, đối số thứ hai là tiền tố.

Đây là khác biệt quan trọng giữa `someString::method` và `String::method`.
