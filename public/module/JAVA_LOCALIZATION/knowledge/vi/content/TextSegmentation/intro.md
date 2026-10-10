# Phân tách văn bản theo ngôn ngữ

Sau khi biết cách dịch, định dạng và sắp xếp văn bản, còn một câu hỏi nền tảng khác: **“đoạn văn bản này nên được chia ở đâu?”**

Nếu chỉ làm với tiếng Anh đơn giản, lập trình viên dễ nghĩ:

```text
ký tự → một char
từ    → split theo dấu cách
câu   → split theo dấu chấm
dòng  → xuống dòng ở dấu cách gần nhất
```

Các giả định này không đúng cho mọi văn bản Unicode và mọi ngôn ngữ. Java cung cấp `BreakIterator` để phân tích ranh giới của văn bản ngôn ngữ tự nhiên.
