Java có thể lấy tiền tệ từ một `Locale`, nhưng quy tắc không đơn giản chỉ là “lấy tiền tệ của khu vực”. Nếu Locale có Unicode extension `cu` và/hoặc `rg`, Java phản ánh các giá trị đó; khi có cả hai thì `cu` được ưu tiên hơn tiền tệ ngầm suy ra từ `rg`. Nếu không có các extension này, Java suy ra từ **thành phần quốc gia (country)** của Locale; thành phần ngôn ngữ (language) và biến thể (variant) không tham gia quyết định này:

```java
Currency currency = Currency.getInstance(Locale.US);

Currency euroPreference = Currency.getInstance(
        Locale.forLanguageTag("en-US-u-cu-eur")
); // EUR
```

Nếu thành phần quốc gia của Locale không phải mã ISO 3166 được hỗ trợ, `Currency.getInstance(locale)` có thể ném `IllegalArgumentException`; với lãnh thổ không có tiền tệ, phương thức có thể trả về `null`. Vì vậy Locale chỉ có ngôn ngữ như `Locale.ENGLISH` không đủ dữ liệu để suy ra tiền tệ của giao dịch.

Nhưng điều đó không có nghĩa mọi giao dịch của người dùng chọn `en-US` đều là USD.

Ví dụ một người dùng giao diện tiếng Việt có thể thanh toán bằng USD:

```java
Locale displayLocale = Locale.forLanguageTag("vi-VN");
Currency transactionCurrency = Currency.getInstance("USD");
```

Hai biến trả lời hai câu hỏi khác nhau:

```text
Locale hiển thị
→ trình bày cho người dùng theo quy ước nào?

tiền tệ giao dịch
→ số tiền này được định giá bằng đơn vị tiền nào?
```

Vì vậy thực thể nghiệp vụ nên lưu mã/đơn vị tiền tệ khi thông tin đó quan trọng, không suy dựng lại từ Locale ở thời điểm hiển thị.
