Gói tài nguyên dùng quy ước tên dựa trên tên cơ sở và các thành phần Locale.

Với:

```java
Locale locale = Locale.forLanguageTag("en-US");
ResourceBundle.getBundle("Messages", locale);
```

Mô hình đơn giản của **việc phân giải gói tài nguyên** là:

```text
Locale yêu cầu en-US
        ↓
tạo chuỗi Locale ứng viên
        ↓
en-US → en → Locale.ROOT
        ↓
tìm gói tài nguyên phù hợp theo từng ứng viên
```

Với Locale có variant/script, danh sách ứng viên có thể chi tiết hơn. Không nên tự mô phỏng thuật toán bằng nối chuỗi; hãy để `ResourceBundle` và `ResourceBundle.Control` xử lý.

Ta có thể quan sát danh sách ứng viên:

```java
ResourceBundle.Control control = ResourceBundle.Control.getControl(
        ResourceBundle.Control.FORMAT_DEFAULT
);

List<Locale> candidates = control.getCandidateLocales(
        "Messages",
        Locale.forLanguageTag("en-US")
);
```

Sau khi gói tài nguyên được phân giải, **tra cứu khóa là một bước khác**: nếu khóa không có trong gói cụ thể, `ResourceBundle` có thể tiếp tục tìm trong chuỗi gói cha đã được thiết lập. Đừng trộn “gói nào được chọn” với “khóa được tìm ở gói/gói cha nào”.

Điểm quan trọng: **cơ chế dự phòng là một phần của hợp đồng tra cứu**, không phải quy tắc `equals` của `Locale`. Dự phòng qua Locale mặc định và chính sách gói tài nguyên gốc sẽ được học sâu ở cột mốc cuối.
