Ba mức cần phân biệt:

```text
đơn vị mã UTF-16 (code unit)
→ đơn vị được các API char/String cơ bản dùng để đếm và đánh chỉ số

điểm mã Unicode (code point)
→ đơn vị mã Unicode

cụm ký tự (grapheme cluster)
→ cụm ký tự người dùng thường cảm nhận như một ký tự hiển thị
```

Một cụm ký tự có thể gồm nhiều điểm mã, ví dụ ký tự cơ sở + dấu kết hợp hoặc một chuỗi emoji gồm nhiều thành phần.

Vì vậy ngay cả `codePointCount` cũng chưa chắc bằng “số ký tự người dùng nhìn thấy”.

Ví dụ:

```text
"e" + dấu sắc kết hợp (COMBINING ACUTE ACCENT)

số điểm mã = 2
người dùng thường nhìn = "é" như một cụm ký tự
```

Chuỗi emoji còn có thể gồm nhiều điểm mã nối bởi **bộ chọn biến thể (variation selector)**, **bộ điều chỉnh màu da (skin-tone modifier)** hoặc **ký tự nối không độ rộng (zero-width joiner)**. Tên tiếng Anh được giữ trong ngoặc để tiện tra cứu tài liệu Unicode.

Quy tắc chọn tầng biểu diễn:

```text
giao thức/lưu trữ dùng chỉ số theo Java String
→ đơn vị mã có thể là tầng đúng

xử lý ký hiệu Unicode
→ điểm mã

di chuyển con trỏ/xóa/đếm theo ký tự người dùng nhìn thấy
→ ranh giới cụm ký tự
```

### CƠ CHẾ — xử lý ranh giới cụm ký tự trong Java

API String cơ bản không có “chỉ số cụm ký tự” thay thế trực tiếp cho `charAt(i)`. Khi logic giao diện/trình soạn thảo thực sự cần di chuyển hoặc cắt theo ký tự người dùng nhìn thấy, cần một API phân đoạn văn bản phù hợp.

Java có `BreakIterator`:

```java
BreakIterator iterator =
        BreakIterator.getCharacterInstance(locale);

iterator.setText(text);
```

Nó cung cấp cơ chế duyệt ranh giới văn bản theo quy tắc vùng miền. Tuy nhiên phân tách cụm ký tự đầy đủ là một phạm vi Unicode/Bản địa hóa rộng hơn, nên chương này chỉ thiết lập ranh giới:

```text
đánh chỉ số theo đơn vị mã
→ String API cơ bản

xử lý theo điểm mã
→ codePoints / codePointAt

ranh giới ký tự người dùng cảm nhận
→ API phân đoạn như BreakIterator
→ quy tắc Unicode/Bản địa hóa sâu hơn nếu nghiệp vụ yêu cầu
```

### String có thể chứa surrogate không ghép cặp

`String` là một chuỗi đơn vị mã UTF-16; nó không tự bảo đảm mọi chuỗi đều là văn bản Unicode hợp lệ về cấu trúc.

```java
String malformed = "\uD83D"; // một đơn vị mã high surrogate đứng riêng
```

Các API như `codePoints()` và `codePointCount(...)` cũng **không phải bộ xác thực Unicode**. Chúng ghép surrogate pair hợp lệ thành một điểm mã, nhưng surrogate đứng riêng vẫn được xử lý như một giá trị riêng thay vì tự động báo lỗi.

Vì vậy “đang có String” hoặc “đã duyệt bằng codePoints()” không đồng nghĩa “đã kiểm tra tính hợp lệ của **chuỗi giá trị vô hướng Unicode (Unicode scalar value sequence)**”. Điều này đặc biệt quan trọng khi mã hóa ra byte hoặc nhận văn bản từ ranh giới không tin cậy. `String` bảo đảm một chuỗi đơn vị mã UTF-16, chứ không tự xác thực toàn bộ văn bản Unicode đầu vào.
