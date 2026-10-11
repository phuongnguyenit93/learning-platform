`Locale` là một đối tượng giá trị bất biến. Hai Locale bằng nhau khi các thành phần tạo nên định danh của chúng bằng nhau.

```java
Locale a = Locale.forLanguageTag("vi-VN");
Locale b = Locale.of("vi", "VN");

System.out.println(a.equals(b)); // true
```

Nhưng “có thể phục vụ cùng bản dịch” không đồng nghĩa với `equals`:

```java
Locale en = Locale.forLanguageTag("en");
Locale enUS = Locale.forLanguageTag("en-US");

System.out.println(en.equals(enUS)); // false
```

`en-US` mang khu vực cụ thể còn `en` không có. Quá trình phân giải tài nguyên có thể đi từ Locale cụ thể tới gói tài nguyên tổng quát hơn, nhưng đó là **quy tắc tra cứu**, không phải phép so sánh bằng.

Khi dùng `Locale` làm khóa trong bộ nhớ đệm/map, hãy nhớ định danh của nó có thể bao gồm ngôn ngữ, hệ chữ viết, khu vực, biến thể và phần mở rộng. Nếu ứng dụng chỉ muốn gom theo ngôn ngữ, hãy lấy rõ `locale.getLanguage()` thay vì dựa vào `equals` của toàn bộ Locale.

Chương tiếp theo chuyển từ đối tượng `Locale` trong Java sang **thẻ ngôn ngữ (language tag)**, dạng văn bản chuẩn giúp thông tin Locale đi qua HTTP, cấu hình, cơ sở dữ liệu và các hệ thống khác.
