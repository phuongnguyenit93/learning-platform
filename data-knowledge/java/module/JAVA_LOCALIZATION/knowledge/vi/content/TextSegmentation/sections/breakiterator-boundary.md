`BreakIterator` giải quyết **phân tích ranh giới**, không giải quyết mọi bài toán xử lý ngôn ngữ tự nhiên.

```text
BreakIterator làm tốt
→ tìm ranh giới ký tự/từ/câu/dòng

BreakIterator không tự làm
→ dịch ngôn ngữ
→ hiểu ý nghĩa ngữ nghĩa của câu
→ stemming / lemmatization
→ tokenization NLP đầy đủ cho mọi miền bài toán
→ dựng văn bản lên màn hình
```

Locale được dùng để chọn quy tắc phù hợp:

```java
BreakIterator iterator = BreakIterator.getWordInstance(
        Locale.forLanguageTag("vi-VN")
);
```

Vì vậy ranh giới trách nhiệm cần giữ là:

```text
Mô-đun String/Unicode
→ văn bản được biểu diễn như thế nào

Bản địa hóa + BreakIterator
→ ranh giới của ngôn ngữ tự nhiên nằm ở đâu

UI / khung làm việc xử lý ngôn ngữ tự nhiên
→ dùng các ranh giới đó để chọn vùng/bố trí/phân tích sâu hơn
```

Chương tiếp theo xử lý một vấn đề khác của văn bản ngôn ngữ tự nhiên: **thứ tự lưu văn bản và thứ tự người dùng nhìn thấy có thể khác nhau khi LTR và RTL xuất hiện cùng nhau**.
