Những API như `replace`, `trim`, `strip`, `toUpperCase`, `toLowerCase` mô tả **giá trị mới**:

```java
String raw = "  java-core  ";

String cleaned = raw.strip();
String renamed = cleaned.replace("core", "string");

System.out.println(raw);     // "  java-core  "
System.out.println(renamed); // "java-string"
```

`trim()` và `strip()` không hoàn toàn là hai tên cho cùng một quy tắc. `strip()` loại ký tự đầu/cuối dựa trên `Character.isWhitespace(...)`, còn `trim()` dùng quy tắc lịch sử: loại các ký tự đầu/cuối có mã không lớn hơn `U+0020`. Vì vậy `strip()` thường phù hợp hơn khi xử lý khoảng trắng theo API Unicode của Java, nhưng cũng không nên đồng nhất máy móc `Character.isWhitespace` với mọi thuộc tính whitespace trong chuẩn Unicode.

Ngoài ra:

```java
text.stripLeading();
text.stripTrailing();
```

### replace khác replaceAll

```java
"a.b".replace(".", "-");    // "a-b"
"a.b".replaceAll(".", "-"); // "---"
```

`replace` nhận ký tự/chuỗi cố định. `replaceAll` nhận Regex, nên `.` mang ngữ nghĩa của dấu chấm trong Regex: mặc định nó khớp một ký tự nhưng không khớp ký tự kết thúc dòng; cờ `DOTALL` có thể thay đổi quy tắc đó. Ví dụ `"a.b"` không chứa ký tự kết thúc dòng nên cả ba ký tự đều bị thay thế.

### Một số API xử lý văn bản hiện đại

Không cần học thuộc toàn bộ API của `String`, nhưng một số thao tác hiện đại đáng biết vì chúng mô tả mục đích rất rõ:

```java
String lines = "alpha\nbeta\n";

lines.lines().forEach(System.out::println);

"ab".repeat(3); // "ababab"
```

`lines()` tạo một luồng (`Stream<String>`) để duyệt từng dòng theo quy ước ký tự kết thúc dòng của chính API, thay vì buộc bên gọi tự quét/cắt văn bản. `repeat(n)` lặp văn bản `n` lần và phù hợp cho định dạng hoặc dữ liệu kiểm thử đơn giản.

Các API như `indent` và `stripIndent` liên quan mạnh tới văn bản nhiều dòng nên được nối tiếp ở chương Text Block.

Chuyển đổi chữ hoa/thường cần phân biệt mục đích:

```text
văn bản ngôn ngữ tự nhiên
→ có thể phụ thuộc Locale

token kỹ thuật / mã định danh giao thức
→ cần quy tắc ổn định theo hợp đồng
```

Quy tắc vùng miền và so sánh thứ tự văn bản (collation) đầy đủ thuộc mô-đun Bản địa hóa (Localization); chương này chỉ thiết lập ranh giới để không coi chuyển đổi chữ hoa/thường là phép chuẩn hóa dùng được cho mọi trường hợp.
