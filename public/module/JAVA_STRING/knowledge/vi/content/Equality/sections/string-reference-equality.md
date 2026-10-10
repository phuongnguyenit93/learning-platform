`==` với kiểu tham chiếu chỉ hỏi hai biến có cùng trỏ tới một đối tượng hay không.

```java
System.out.println(a == b);
```

không phải phép so sánh nội dung.

String Pool làm một số literal dùng chung tham chiếu, nhưng mã đúng không nên phụ thuộc vào cơ chế tối ưu đó để quyết định hai chuỗi có cùng nội dung hay không.

Mô hình tư duy:

```text
a ─────► đối tượng String #1: "java"

b ─────► đối tượng String #2: "java"

a == b
→ đối tượng #1 có phải đối tượng #2?

a.equals(b)
→ chuỗi nội dung có bằng nhau?
```

`==` với String chỉ nên được dùng khi **định danh tham chiếu chính là câu hỏi cần quan sát**, ví dụ thí nghiệm về String Pool hoặc `intern()`.
