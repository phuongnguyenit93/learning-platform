`String.compareTo` có một ưu điểm lớn: cho kết quả xác định và không phụ thuộc Locale, phù hợp cho nhiều khóa/giao thức/thứ tự nội bộ.

`Collator` phù hợp khi thứ tự cần phản ánh **mong đợi của người đọc**.

| Bài toán | Lựa chọn thường hợp lý |
| --- | --- |
| sắp xếp tên người cho UI | `Collator` theo Locale của người dùng |
| sắp xếp nhãn sản phẩm đã bản địa hóa | `Collator` |
| khóa kỹ thuật cần thứ tự ổn định | thứ tự không phụ thuộc Locale |
| token của giao thức | hợp đồng của giao thức, không dùng Locale người dùng |
| chỉ mục cơ sở dữ liệu | theo collation của DB/schema, không giả định giống JVM |

Ví dụ:

```java
List<String> names = new ArrayList<>(List.of("An", "Ân", "Anh", "Ánh"));

Collator collator = Collator.getInstance(
        Locale.forLanguageTag("vi-VN")
);
names.sort(collator);
```

Đừng dùng `toLowerCase()` rồi `compareTo()` như một bản thay thế cho sắp xếp theo ngôn ngữ. Chuyển đổi chữ hoa/chữ thường và collation là hai bài toán khác nhau.
