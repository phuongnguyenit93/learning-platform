`BreakIterator.getWordInstance(locale)` giúp tìm các ranh giới của văn bản theo quy tắc của Locale:

```java
BreakIterator words = BreakIterator.getWordInstance(locale);
words.setText(text);
```

Không nên hiểu API này đơn giản là “trả danh sách từ đã lọc sạch dấu câu”. `BreakIterator` chủ yếu trả **vị trí ranh giới**. Mã sử dụng vẫn phải quyết định đoạn nào là từ có ý nghĩa cho trường hợp sử dụng của mình.

Tương tự:

```java
BreakIterator sentences = BreakIterator.getSentenceInstance(locale);
sentences.setText(text);
```

giúp tìm ranh giới câu mà không ghi cứng quy tắc tách theo dấu chấm trực tiếp như `split("\\.")`.

Tại sao `split(" ")` / `split("\\.")` vẫn là mô hình yếu?

```text
dấu cách không phải dấu phân cách từ chung cho mọi ngôn ngữ
dấu câu có thể nằm trong từ viết tắt hoặc số
dấu kết thúc câu khác nhau theo ngôn ngữ
văn bản Unicode có nhiều loại khoảng trắng/dấu câu
```

`BreakIterator` đưa kiến thức về ranh giới ngôn ngữ/Unicode xuống API chuẩn thay vì bắt ứng dụng tự đoán.
