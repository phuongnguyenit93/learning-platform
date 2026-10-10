**Điểm mã (code point)** là một giá trị Unicode như `U+0041` hoặc `U+1F600`.

Java thường biểu diễn điểm mã bằng `int`, vì toàn bộ không gian Unicode lớn hơn phạm vi một `char`.

Điểm mã thường được viết dạng:

```text
U+0041  → A
U+00E9  → é
U+1F600 → 😀
```

API như:

```java
text.codePointCount(0, text.length());
text.codePoints();
```

giúp làm việc ở mức điểm mã thay vì đơn vị mã.

Một API hỗ trợ quan trọng khác:

```java
char[] chars = Character.toChars(0x1F600); // cặp surrogate cho 😀
```

`int` ở đây không có nghĩa mọi số nguyên đều nằm trong phạm vi điểm mã Unicode. `Character.isValidCodePoint(cp)` kiểm tra phạm vi `0..0x10FFFF`, nhưng **không đồng nghĩa `cp` là một giá trị vô hướng Unicode (Unicode scalar value)**: các giá trị surrogate `U+D800..U+DFFF` vẫn nằm trong phạm vi điểm mã. Nếu nghiệp vụ cần một giá trị vô hướng hợp lệ, phải loại riêng vùng surrogate ngoài việc kiểm tra phạm vi.
