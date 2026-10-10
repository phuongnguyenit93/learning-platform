Trong UTF-16, điểm mã ngoài BMP được biểu diễn bằng một **high surrogate + low surrogate** (surrogate cao + surrogate thấp).

Ví dụ emoji có thể khiến:

```text
String.length() == 2
codePointCount(...) == 1
```

Nếu duyệt từng `char`, mã có thể tách đôi một điểm mã hợp lệ.

```java
String emoji = "😀";

char high = emoji.charAt(0);
char low  = emoji.charAt(1);

Character.isHighSurrogate(high); // true
Character.isLowSurrogate(low);   // true
```

Hai `char` riêng lẻ không tương đương hai ký tự người dùng.
