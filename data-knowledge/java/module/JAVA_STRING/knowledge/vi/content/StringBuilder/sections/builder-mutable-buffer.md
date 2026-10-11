```java
StringBuilder builder = new StringBuilder();
builder.append("Hello");
builder.append(' ');
builder.append(name);
String result = builder.toString();
```

Khác String, cùng một đối tượng `StringBuilder` có thể thay đổi bộ đệm nội bộ qua nhiều lần `append`.

Đây là lý do `StringBuilder` phù hợp khi xây chuỗi tăng dần trong một phạm vi kiểm soát rõ.

### VÌ SAO — StringBuilder giải quyết vấn đề gì?

String bất biến rất tốt cho việc chia sẻ, nhưng không lý tưởng nếu ta cần xây kết quả qua rất nhiều bước:

```text
nối String lặp lại
→ nhiều giá trị String bất biến trung gian

StringBuilder
→ một đối tượng xây chuỗi có thể thay đổi
→ append nhiều lần
→ toString khi hoàn tất
```

### Nối tiếp nhiều lời gọi append

Nhiều phương thức thay đổi nội dung trả lại chính đối tượng `StringBuilder`:

```java
String result = new StringBuilder()
        .append("user=")
        .append(userId)
        .append(", active=")
        .append(active)
        .toString();
```

`append` có nhiều overload cho giá trị nguyên thủy, String, `CharSequence` và đối tượng. `StringBuilder` là công cụ xây chuỗi, không phải “String có thể thay đổi”.
