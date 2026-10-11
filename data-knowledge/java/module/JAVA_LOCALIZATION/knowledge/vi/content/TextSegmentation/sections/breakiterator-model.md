`BreakIterator` là API xác định **các vị trí biên hợp lệ** trong một chuỗi văn bản.

Nó có bốn vai trò chính:

```text
ranh giới ký tự
→ ranh giới đơn vị ký tự người dùng nhìn thấy

ranh giới từ
→ ranh giới từ/token ở mức ngôn ngữ tự nhiên

ranh giới câu
→ ranh giới câu

ranh giới dòng
→ vị trí có thể ngắt dòng
```

Ta cần nó vì **ranh giới trong văn bản không phải lúc nào cũng suy ra đúng bằng một ký tự ASCII cố định**.

Ví dụ:

```text
"hello world"
```

có dấu cách rõ ràng, nhưng nhiều hệ chữ/ngôn ngữ không dùng dấu cách theo cách giống tiếng Anh. Tương tự, dấu chấm không phải lúc nào cũng có nghĩa “kết thúc câu”.

Các phương thức tạo chính:

```java
BreakIterator.getCharacterInstance(locale);
BreakIterator.getWordInstance(locale);
BreakIterator.getSentenceInstance(locale);
BreakIterator.getLineInstance(locale);
```

Sau khi gắn văn bản bằng `setText(...)`, bộ lặp di chuyển qua các ranh giới bằng `first()`, `next()`, `previous()`, `following(...)`, `preceding(...)`.
