`MessageFormat` là **bộ định dạng dành cho một mẫu thông điệp có tham số**. Nó nhận một mẫu, các đối số và một `Locale`, rồi tạo ra câu cuối cùng.

Các thành phần chính:

```text
mẫu (pattern)
→ "Order {0} was created for {1}."

tham số giữ chỗ / chỉ số đối số
→ {0}, {1}, ...

giá trị đối số
→ 1001, "An", ...

kiểu/cách định dạng tùy chọn
→ number, date, choice...

Locale
→ ảnh hưởng các bộ định dạng con phụ thuộc Locale
```

Vai trò của nó **không phải dịch câu**. `ResourceBundle` thường cung cấp câu/mẫu đã dịch; `MessageFormat` chỉ đưa dữ liệu động vào mẫu đó theo đúng vị trí và cách định dạng.

Mẫu cơ bản dùng chỉ số:

```text
Order {0} was created for {1}.
```

Java:

```java
MessageFormat format = new MessageFormat(
        "Order {0} was created for {1}.",
        Locale.US
);

String text = format.format(new Object[] {1001L, "An"});
```

Điểm quan trọng là **thứ tự trong câu thuộc mẫu**, không thuộc mã nguồn nối chuỗi.

Gói tài nguyên tiếng Anh có thể là:

```properties
order.created=Order {0} was created for {1}.
```

Gói tài nguyên tiếng Việt:

```properties
order.created=Đơn hàng {0} của {1} đã được tạo.
```

Mã nguồn dùng cùng khóa + các đối số:

```java
String pattern = bundle.getString("order.created");
MessageFormat formatter = new MessageFormat(pattern, locale);
String message = formatter.format(new Object[] {order.id(), customerName});
```

### Vì sao không nối chuỗi?

```java
"Order " + id + " of " + customer + " created"
```

Nối chuỗi khóa người dịch vào thứ tự do lập trình viên quyết định. Với ngôn ngữ khác, vị trí chủ ngữ/tân ngữ hoặc cách biểu đạt có thể cần đổi. Tham số giữ chỗ giúp toàn bộ câu nằm trong tài nguyên dịch.
