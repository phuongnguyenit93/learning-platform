`MessageFormat` có Locale riêng vì các bộ định dạng con như `number`/`date` phụ thuộc Locale.

```java
MessageFormat vi = new MessageFormat("Tổng: {0,number}", Locale.forLanguageTag("vi-VN"));
MessageFormat us = new MessageFormat("Total: {0,number}", Locale.US);

System.out.println(vi.format(new Object[] {1234567.89}));
System.out.println(us.format(new Object[] {1234567.89}));
```

Cùng giá trị số nhưng các dấu phân cách có thể khác.

Không nên tải mẫu theo `vi-VN` rồi vô tình định dạng đối số bằng Locale mặc định khác của JVM. Một luồng xử lý nhất quán thường là:

```text
Locale từ yêu cầu/người dùng
        ↓
ResourceBundle(locale)
        ↓
mẫu
        ↓
MessageFormat(mẫu, cùng Locale)
        ↓
thông điệp đã bản địa hóa
```

`MessageFormat` là bộ định dạng có thể thay đổi trạng thái và các `Format` của `java.text` nói chung không nên được chia sẻ vô điều kiện giữa nhiều luồng. Cách đơn giản ở phía máy chủ là tạo bộ định dạng cho từng thao tác/yêu cầu, hoặc quản lý đồng bộ hóa/bộ nhớ đệm một cách có chủ đích.

Chương tiếp theo rời khỏi việc định dạng toàn bộ thông điệp để đi sâu vào một thành phần xuất hiện rất thường xuyên: **số**.
