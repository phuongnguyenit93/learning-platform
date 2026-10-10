Với biến cục bộ bị bắt giữ, lambda giữ lại **giá trị của liên kết biến cục bộ** mà hành vi cần dùng.

Với kiểu nguyên thủy, đó là giá trị nguyên thủy:

```java
int offset = 10;
IntUnaryOperator addOffset = value -> value + offset;
```

Với biến tham chiếu, giá trị được giữ lại là tham chiếu đối tượng:

```java
String prefix = "ID-";
Function<Integer, String> formatter = value -> prefix + value;
```

Lambda không có một liên kết đặc biệt tới một "ô biến cục bộ" có thể bị đổi sang giá trị khác sau đó. Quy tắc không bị gán lại sau khi khởi tạo (effectively final) chính là thứ ngăn việc gán lại biến cục bộ đã được bắt giữ.

Điểm này cũng giải thích vì sao một tham chiếu bị bắt giữ vẫn có thể trỏ tới đối tượng có thể thay đổi: **giá trị tham chiếu** không đổi, nhưng đối tượng mà tham chiếu trỏ tới vẫn có thể thay đổi trạng thái.
