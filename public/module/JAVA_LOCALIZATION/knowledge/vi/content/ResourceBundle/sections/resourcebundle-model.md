Nói đơn giản, `ResourceBundle` là **cơ chế tra cứu tài nguyên theo khóa + Locale**.

Nó không dịch một câu tiếng Anh thành tiếng Việt bằng AI hay thuật toán. Lập trình viên/nhóm dịch **chuẩn bị sẵn các tài nguyên**, còn `ResourceBundle` làm nhiệm vụ chọn đúng tài nguyên tại thời gian chạy.

Một hệ gói tài nguyên thường có năm mảnh:

```text
tên cơ sở (base name)
→ tên của cả họ tài nguyên, ví dụ Messages

Locale
→ Locale đang cần phục vụ, ví dụ vi-VN

họ gói tài nguyên
→ Messages.properties, Messages_vi.properties, Messages_vi_VN.properties...

khóa tài nguyên
→ định danh ổn định, ví dụ order.created

giá trị tài nguyên
→ nội dung thực tế, ví dụ "Đơn hàng đã được tạo"
```

Vai trò của `ResourceBundle` là nối năm mảnh đó lại và áp dụng quy tắc ứng viên/dự phòng để tìm giá trị phù hợp.

Giả sử UI cần thông điệp `order.created`.

Nếu ghi cứng trong mã nguồn:

```java
String message;
if (locale.getLanguage().equals("vi")) {
    message = "Đơn hàng đã được tạo";
} else {
    message = "Order created";
}
```

thì mã nguồn phải biết mọi ngôn ngữ và mọi câu dịch. `ResourceBundle` chuyển mô hình đó thành:

```text
mã nguồn chỉ biết khóa ổn định
        ↓
order.created
        ↓
ResourceBundle + Locale
        ↓
tài nguyên phù hợp
        ↓
văn bản đã bản địa hóa
```

Ví dụ các tệp:

```text
Messages.properties
Messages_en.properties
Messages_en_US.properties
Messages_vi.properties
Messages_vi_VN.properties
```

Nội dung:

```properties
# Messages_en.properties
order.created=Order created

# Messages_vi.properties
order.created=Đơn hàng đã được tạo
```

Mã nguồn:

```java
Locale locale = Locale.forLanguageTag("vi-VN");
ResourceBundle bundle = ResourceBundle.getBundle("Messages", locale);

String message = bundle.getString("order.created");
```

Ở đây `Messages` là **tên cơ sở (base name)**, `order.created` là **khóa tài nguyên**, còn Locale quyết định gói cụ thể nào được ưu tiên.

`ResourceBundle` không chỉ dùng cho câu chữ; nó có thể cung cấp các tài nguyên/giá trị khác. Tuy nhiên trong ứng dụng hiện đại, trường hợp sử dụng phổ biến nhất là bản địa hóa thông điệp.
