Nhóm kiểm tra trả lời các câu hỏi như: chuỗi dài bao nhiêu, có rỗng không, có chỉ chứa khoảng trắng không, hoặc đơn vị mã tại một vị trí là gì.

```java
String text = " Java ";

text.length();   // 6
text.isEmpty();  // false
text.isBlank();  // false
text.charAt(1);  // 'J'
```

Ba khái niệm dễ nhầm:

```text
""        → rỗng
"   "     → không rỗng nhưng chỉ chứa khoảng trắng
" Java "  → không rỗng, không chỉ chứa khoảng trắng
```

`isBlank()` dùng khái niệm khoảng trắng của `Character.isWhitespace(...)`: chuỗi rỗng hoặc chỉ gồm các code point được API này xem là whitespace sẽ được coi là blank.

`length()` và `charAt()` làm việc theo **đơn vị mã UTF-16 (code unit)**, không đảm bảo một `char` bằng một ký tự người dùng nhìn thấy. Chương Unicode sẽ đi sâu vào ranh giới này.

Chỉ số hợp lệ của `charAt(index)` là:

```text
0 <= index < length()
```

```java
"Java".charAt(4); // StringIndexOutOfBoundsException
```

Với ký tự nằm ngoài BMP:

```java
String emoji = "😀";

emoji.length();  // 2
emoji.charAt(0); // high surrogate, chưa phải toàn bộ emoji
```

Đây là lý do không được mặc định “1 char = 1 ký tự người dùng nhìn thấy”.
