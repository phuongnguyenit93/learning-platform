`BreakIterator.getLineInstance(locale)` tìm các **vị trí có thể ngắt dòng** — những vị trí mà bộ dựng hiển thị văn bản có thể xem xét để xuống dòng.

Khác với:

```text
\n
→ newline đã tồn tại trong dữ liệu
```

vị trí có thể ngắt dòng trả lời:

```text
Nếu UI phải tự ngắt một dòng dài,
chỗ nào là ranh giới hợp lệ để cân nhắc ngắt?
```

Đây là kiến thức quan trọng cho UI/bộ máy bố trí, dựng tài liệu và trình soạn thảo văn bản. Phần xử lý phía máy chủ thông thường hiếm khi tự bố trí văn bản, nhưng lập trình viên nên biết việc “cắt dòng mỗi N ký tự” có thể phá văn bản ngôn ngữ tự nhiên.
