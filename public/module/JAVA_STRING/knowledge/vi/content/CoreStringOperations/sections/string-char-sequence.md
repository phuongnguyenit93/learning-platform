`String` triển khai `CharSequence`. Đây là tầng trừu tượng cho một chuỗi `char` có thể đọc theo chỉ số:

```text
CharSequence
    ↑
    ├── String
    ├── StringBuilder
    └── StringBuffer
```

Điểm quan trọng là **CharSequence không đồng nghĩa bất biến**. `String` bất biến, còn `StringBuilder` và `StringBuffer` là các chuỗi ký tự có thể thay đổi.

Nhiều API nhận `CharSequence` để không ép bên gọi phải có đúng một `String`:

```java
String text = "java-core";
StringBuilder token = new StringBuilder("java");

text.contains(token);       // true
text.contentEquals(token);  // false vì nội dung khác "java-core"
```

Một điểm dễ nhầm cần nhớ: `CharSequence` không định nghĩa một quy ước `equals` chung giữa mọi kiểu triển khai.

```java
String s = "java";
StringBuilder b = new StringBuilder("java");

s.equals(b);        // false
s.contentEquals(b); // true
```

Khi hợp đồng cần so nội dung với một `CharSequence`, không cần chuyển mọi chuỗi ký tự thành `String` chỉ để so sánh; `contentEquals(...)` thể hiện trực tiếp ý định đó.

Vì vậy:

```text
so sánh nội dung String với String
→ equals

so sánh nội dung String với CharSequence
→ contentEquals khi quy ước phù hợp

tầng trừu tượng CharSequence
→ không tự bảo đảm equals giữa các kiểu triển khai khác nhau
```
