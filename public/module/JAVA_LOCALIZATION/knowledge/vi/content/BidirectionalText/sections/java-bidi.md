Java cung cấp `java.text.Bidi` để phân tích văn bản hai chiều.

Ví dụ:

```java
Bidi bidi = new Bidi(
        text,
        Bidi.DIRECTION_DEFAULT_LEFT_TO_RIGHT
);

boolean baseLtr = bidi.baseIsLeftToRight();
int runCount = bidi.getRunCount();
```

Có thể kiểm tra từng đoạn:

```java
for (int i = 0; i < bidi.getRunCount(); i++) {
    int start = bidi.getRunStart(i);
    int limit = bidi.getRunLimit(i);
    int level = bidi.getRunLevel(i);
}
```

Một số câu hỏi API có thể trả lời:

```text
hướng nền của đoạn văn là gì?
văn bản có thật sự cần xử lý bidi không?
có bao nhiêu đoạn có hướng?
mỗi đoạn bắt đầu/kết thúc ở đâu?
mức nhúng của đoạn là bao nhiêu?
```

`Bidi.requiresBidi(...)` có thể giúp kiểm tra một phạm vi ký tự có cần xử lý bidi hay không.
