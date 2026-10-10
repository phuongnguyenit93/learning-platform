Với dữ liệu đến từ thẻ ngôn ngữ (language tag), cách tự nhiên là:

```java
Locale locale = Locale.forLanguageTag("vi-VN");
```

Khi mã nguồn đã có từng thành phần riêng, Java 21 hỗ trợ các phương thức tạo `Locale.of(...)`:

```java
Locale vi = Locale.of("vi");
Locale viVN = Locale.of("vi", "VN");
```

Khi cần hệ chữ viết, phần mở rộng hoặc cấu hình chi tiết hơn, dùng `Locale.Builder`:

```java
Locale locale = new Locale.Builder()
        .setLanguage("zh")
        .setScript("Hant")
        .setRegion("TW")
        .build();
```

`Builder` hữu ích khi muốn kiểm tra dữ liệu chặt hơn: subtag không hợp lệ có thể gây `IllformedLocaleException` thay vì âm thầm tạo một đối tượng khó hiểu.

Các hằng số phổ biến như `Locale.US`, `Locale.UK`, `Locale.JAPAN` tiện cho những locale được Java định nghĩa sẵn, nhưng không nên ép mọi locale của ứng dụng vào một danh sách ghi cứng.

### Không dùng Locale để suy diễn quá nhiều

Một `Locale` có khu vực có thể giúp Java chọn tiền tệ mặc định hoặc quy ước định dạng, nhưng nó không phải hồ sơ người dùng:

```text
Locale.US
≠ địa chỉ người dùng
≠ quốc tịch
≠ múi giờ
≠ tiền tệ mà giao dịch bắt buộc phải dùng
```

Nghiệp vụ nào cần tiền tệ, múi giờ hay quốc gia riêng thì phải mô hình hóa chúng riêng.
