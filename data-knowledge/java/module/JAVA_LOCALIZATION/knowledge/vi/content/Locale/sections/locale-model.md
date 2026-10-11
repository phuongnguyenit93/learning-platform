`Locale` mô tả một **ngữ cảnh văn hóa/ngôn ngữ** thông qua các thành phần như:

```text
ngôn ngữ (language)
→ ngôn ngữ, ví dụ vi, en, ja

hệ chữ viết (script)
→ hệ chữ, ví dụ Latn, Cyrl, Hans, Hant

khu vực/quốc gia (region/country)
→ vùng/quốc gia, ví dụ VN, US, GB

biến thể / phần mở rộng (variant / extensions)
→ thông tin bổ sung cho các trường hợp chuyên biệt
```

### Locale là gì và có vai trò gì?

`Locale` là một **đối tượng mô tả lựa chọn/ngữ cảnh**, không phải đối tượng tự dịch câu chữ và cũng không tự định dạng dữ liệu.

Vai trò của nó là làm **đầu vào cho những API phụ thuộc ngôn ngữ/vùng**:

```text
Locale
  ├─→ ResourceBundle      → chọn tài nguyên
  ├─→ NumberFormat        → cách hiển thị số
  ├─→ DateTimeFormatter   → tên tháng/ngày + mẫu hiển thị
  ├─→ Currency display    → ký hiệu/tên tiền tệ
  └─→ Collator            → thứ tự so sánh văn bản
```

Vì vậy hãy nghĩ `Locale` như **“bộ ngữ cảnh để Java biết nên áp dụng quy ước nào”**, chứ không phải bản thân quy ước hay bản dịch.

Ví dụ:

```java
Locale vietnameseVietnam = Locale.forLanguageTag("vi-VN");
Locale englishUS = Locale.forLanguageTag("en-US");
Locale chineseTraditionalTaiwan = Locale.forLanguageTag("zh-Hant-TW");
```

### Locale không phải vị trí địa lý tuyệt đối

`Locale` không có nghĩa “thiết bị đang ở quốc gia này”. Nó là ngữ cảnh dùng để chọn quy ước ngôn ngữ và cách trình bày.

Một người đang sống ở Việt Nam vẫn có thể chọn `en-US`. Một máy chủ ở Singapore vẫn có thể định dạng phản hồi cho người dùng `vi-VN`.

### Locale thường đến từ đâu?

Trong ứng dụng thực tế, locale có thể được quyết định từ nhiều nguồn:

```text
ngôn ngữ/vùng người dùng đã chọn trong hồ sơ
ưu tiên ngôn ngữ từ HTTP/trình duyệt
tham số hoặc cấu hình của ứng dụng
locale mặc định do sản phẩm quyết định
Locale mặc định của JVM — chỉ nên dùng khi đó thật sự là chính sách mong muốn
```

Điểm quan trọng không phải nguồn nào “luôn đúng”, mà là ứng dụng phải có **một chính sách rõ ràng để chọn Locale** thay vì để môi trường JVM vô tình quyết định.

Nếu cần hiển thị chính tên Locale cho người dùng, `Locale` cũng cung cấp các API như `getDisplayLanguage(...)`, `getDisplayCountry(...)` và `getDisplayName(...)`; Locale truyền vào các phương thức này quyết định ngôn ngữ dùng để hiển thị tên đó.

### Locale không chứa múi giờ

Đây là ranh giới cực kỳ quan trọng:

```text
Locale
→ ngôn ngữ, tên tháng/ngày, mẫu hiển thị, ký hiệu số...

ZoneId
→ quy tắc offset của một vùng thời gian
```

`Locale.forLanguageTag("vi-VN")` **không tự động có nghĩa** `Asia/Ho_Chi_Minh`.

Khi hiển thị thời điểm, ứng dụng thường cần cả hai:

```java
Locale locale = Locale.forLanguageTag("vi-VN");
ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
```
