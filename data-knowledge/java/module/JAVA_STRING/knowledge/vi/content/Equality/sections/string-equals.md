`String.equals` so sánh chuỗi nội dung theo hợp đồng của `String`:

```java
String a = new String("java");
String b = new String("java");

System.out.println(a.equals(b)); // true
```

Khi câu hỏi là “hai giá trị văn bản có cùng nội dung không?”, `equals` là lựa chọn mặc định.

### equals phân biệt chữ hoa và chữ thường

```java
"Java".equals("java"); // false
```

`equals` kiểm tra sự bằng nhau của giá trị String; nó không tự chuẩn hóa Unicode, không thực hiện so sánh thứ tự theo vùng miền và cũng không thực hiện mọi quy tắc gấp chữ hoa/thường.

### So sánh an toàn khi có null

Gọi phương thức trên `null` sẽ lỗi:

```java
String actual = null;
// actual.equals("java"); // NullPointerException
```

Khi giá trị mong đợi chắc chắn khác null:

```java
"java".equals(actual); // false
```

Khi cả hai phía đều có thể null:

```java
Objects.equals(left, right);
```

`Objects.equals` xử lý null trước rồi mới gọi tiếp `equals` khi phù hợp.

### Thứ tự sắp xếp khác với phép so sánh bằng nhau

`compareTo` trả lời câu hỏi về thứ tự từ điển theo chuỗi giá trị `char`/đơn vị mã UTF-16 của String:

```java
"abc".compareTo("abc"); // 0
"abc".compareTo("abd"); // < 0
"abd".compareTo("abc"); // > 0
```

Đừng giả định kết quả luôn là `-1`, `0` hoặc `1`; quy ước quan trọng là **dấu** của kết quả.

Đây là thứ tự tự nhiên của `String`, không phải quy tắc sắp xếp theo ngôn ngữ của con người. Nó hữu ích cho nhiều giá trị kỹ thuật; sắp xếp theo ngôn ngữ/vùng miền có thể cần `Collator` trong mô-đun Bản địa hóa (Localization).
