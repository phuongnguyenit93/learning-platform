`equalsIgnoreCase` hữu ích cho một số phép so sánh đơn giản, nhưng quy tắc chữ hoa/thường có thể phụ thuộc ngôn ngữ và vùng miền.

Quan trọng: `equalsIgnoreCase` **không dùng Locale**. Nó áp dụng quy tắc so sánh không phân biệt hoa/thường của String, nên không phải phép sắp xếp/so sánh theo vùng miền và có thể không cho ngữ nghĩa phù hợp với một số ngôn ngữ.

Nếu bài toán thực sự cần so khớp văn bản theo vùng miền, hãy dùng API và `Locale` phù hợp thay vì mặc định gọi `toLowerCase()` không tham số rồi so chuỗi.

Lỗi tư duy phổ biến:

```java
a.toLowerCase().equals(b.toLowerCase());
```

Lời gọi không truyền `Locale` dùng locale mặc định của tiến trình và còn tạo String trung gian. Nếu nghiệp vụ cần so sánh theo vùng miền, locale phải là một phần được chỉ rõ trong hợp đồng xử lý.

Nếu đây là mã định danh kỹ thuật hoặc token của giao thức, hãy theo đúng quy tắc của giao thức/nghiệp vụ; đừng coi việc chuyển chữ thường theo locale mặc định là một phép chuẩn hóa dùng được cho mọi trường hợp.

```text
mã định danh kỹ thuật/token giao thức
→ thường cần quy tắc ổn định, không phụ thuộc locale

văn bản ngôn ngữ tự nhiên
→ có thể cần so sánh/sắp xếp theo locale
```

Mô-đun Bản địa hóa (Localization) đi sâu hơn vào `Locale` và `Collator`.

Chương tiếp theo xây mô hình tư duy cho các thao tác String dùng hằng ngày: kiểm tra, tìm kiếm, trích xuất, biến đổi, tách/ghép và định dạng.
