`Collator` có thể hiểu là một **`Comparator<String>` chuyên cho ngôn ngữ của con người**. Nó nhận quy tắc sắp xếp ngôn ngữ (collation) tương ứng với Locale và cho biết hai chuỗi nên được xem là bằng nhau hay đứng trước/sau nhau trong ngữ cảnh đó.

Các mảnh chính cần nhớ:

```text
Locale / quy tắc collation
→ bộ quy tắc ngôn ngữ cần áp dụng

strength
→ mức khác biệt nào được coi là quan trọng

decomposition
→ cách xử lý các dạng biểu diễn Unicode tương đương/gần nhau

compare(...)
→ thực hiện so sánh

CollationKey
→ dạng biểu diễn tối ưu cho trường hợp phải so sánh lặp lại nhiều lần
```

Ta cần `Collator` khi **thứ tự dành cho người đọc** quan trọng. Nếu chỉ cần thứ tự kỹ thuật ổn định cho khóa/giao thức, `String.compareTo` hoặc comparator không phụ thuộc Locale thường phù hợp hơn.

`String.compareTo` so sánh theo thứ tự từ điển của các `char` UTF-16 trong chuỗi. Nó phù hợp cho nhiều bài toán kỹ thuật cần thứ tự ổn định, nhưng không phải công cụ sắp xếp theo quy tắc ngôn ngữ hoàn chỉnh.

`Collator` nhận `Locale` để áp dụng quy tắc collation phù hợp:

```java
Collator collator = Collator.getInstance(
        Locale.forLanguageTag("vi-VN")
);

int result = collator.compare("An", "Ân");
```

Mô hình tư duy:

```text
hai chuỗi dành cho người dùng
        ↓
Locale
        ↓
Collator
        ↓
so sánh theo quy tắc ngôn ngữ
```

`compare(a, b)` trả:

```text
< 0 → a đứng trước b
= 0 → bằng nhau ở mức `strength` hiện tại
> 0 → a đứng sau b
```

Giống `Comparator`, con số cụ thể không quan trọng; chỉ dấu âm/0/dương có ý nghĩa theo hợp đồng API.
