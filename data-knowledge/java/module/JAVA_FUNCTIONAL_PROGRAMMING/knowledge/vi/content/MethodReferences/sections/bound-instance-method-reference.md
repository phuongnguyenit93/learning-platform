Tham chiếu tới phương thức của một đối tượng cụ thể có dạng `object::instanceMethod`. Đối tượng nhận đã được cố định, vì vậy giao diện hàm đích chỉ cần cung cấp các đối số còn lại của phương thức.

```java
String prefix = "ID-";
Function<String, String> addPrefix = prefix::concat;

String value = addPrefix.apply("17"); // "ID-17"
```

Ở đây `prefix` là đối tượng nhận của `concat`. `Function.apply` chỉ cung cấp một đối số `String`.

Vì đối tượng nhận được giữ lại khi tạo tham chiếu, cần cẩn thận nếu đối tượng đó có thể thay đổi. Nhiều lần dùng cùng tham chiếu vẫn có thể quan sát trạng thái mới của chính đối tượng ấy.
