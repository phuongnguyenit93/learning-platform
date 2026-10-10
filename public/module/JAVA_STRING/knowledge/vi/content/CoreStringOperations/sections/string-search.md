Khi chỉ cần tìm một đoạn văn bản cố định, các API String trực tiếp thường rõ ràng hơn Regex:

```java
String path = "/api/users/42";

path.startsWith("/api/");      // true
path.endsWith("42");           // true
path.contains("users");        // true
path.indexOf("users");         // 5
path.lastIndexOf('/');          // 10
```

`indexOf(...)` và `lastIndexOf(...)` trả `-1` khi không tìm thấy. Nếu đã lấy chỉ số để cắt chuỗi, phải kiểm tra phạm vi trước khi dùng chỉ số đó.

```java
int slash = path.lastIndexOf('/');
if (slash >= 0) {
    String id = path.substring(slash + 1);
}
```

Regex chỉ nên xuất hiện khi câu hỏi thực sự là **so khớp mẫu**, không phải vì mọi thao tác tìm kiếm trên String đều cần Regex.

`contains` không diễn giải Regex:

```java
System.out.println("file-123.txt".contains("\\d+")); // false
```

```text
tìm kiếm đoạn văn bản cố định
→ contains / indexOf / startsWith / endsWith

tìm kiếm theo mẫu
→ regex
```
