Một số phần mở rộng, đặc biệt nhóm **Unicode locale extension** bắt đầu bằng `u`, có thể mang tùy chọn mà các API bản địa hóa hiểu được.

Ví dụ:

```text
th-TH-u-ca-buddhist
       └───────────→ yêu cầu Phật lịch cho phần trình bày nếu API hỗ trợ

en-US-u-nu-thai
       └────────→ yêu cầu hệ chữ số Thái nếu API hỗ trợ
```

Mô hình tư duy cần giữ là:

```text
language / script / region
→ định danh ngữ cảnh Locale chính

phần mở rộng (extension)
→ tùy chọn bổ sung mà một số dịch vụ bản địa hóa có thể đọc

Locale
≠ ZoneId
≠ Currency của giao dịch
≠ dữ liệu nghiệp vụ tùy ý
```

Không phải mọi API đều hiểu mọi phần mở rộng. Ở chương Bản địa hóa ngày giờ theo Locale, ta sẽ thấy ví dụ cụ thể khi `DateTimeFormatter.localizedBy(locale)` đọc một số tùy chọn mở rộng từ Locale.

Không cần học thuộc toàn bộ cú pháp BCP 47 ở mức nhập môn. Điều quan trọng là hiểu tag **có cấu trúc**, vì vậy nên để API chuẩn phân tích/xây dựng thay vì tự cắt chuỗi.

Hệ chữ viết đặc biệt quan trọng khi cùng một ngôn ngữ có nhiều hệ chữ:

```java
Locale simplified = Locale.forLanguageTag("zh-Hans-CN");
Locale traditional = Locale.forLanguageTag("zh-Hant-TW");
```

Không nên suy ra hệ chữ chỉ từ khu vực nếu dữ liệu đã có script rõ ràng.

Tương tự, `en-US` và `en-GB` cùng ngôn ngữ `en` nhưng khu vực khác nhau có thể dẫn tới khác biệt ở định dạng ngày, quy ước tiền tệ và một số từ vựng.
