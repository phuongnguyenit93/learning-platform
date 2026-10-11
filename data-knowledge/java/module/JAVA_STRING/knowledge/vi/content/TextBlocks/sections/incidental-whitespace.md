Trình biên dịch xử lý một phần thụt lề chỉ phục vụ trình bày mã nguồn để Text Block có thể đặt đẹp trong mã mà không bắt buộc đầu ra giữ toàn bộ khoảng trắng đầu dòng đó.

Mô hình tư duy:

```text
thụt lề trong mã nguồn để code dễ đọc
        ↓ trình biên dịch xác định phần thụt lề phát sinh
loại phần thụt lề phát sinh
        ↓
nội dung String
```

Vị trí dấu đóng có thể ảnh hưởng lượng thụt lề được xem là phát sinh, nên dấu đóng và nội dung cần được đặt nhất quán.

Khoảng trắng bên trong văn bản vẫn quan trọng. Khi đầu ra phải chính xác, hãy kiểm tra String thực tế thay vì suy luận bằng mắt từ thụt lề của mã nguồn.

Khoảng trắng ở cuối dòng cũng được xử lý để tránh định dạng vô hình trong mã nguồn vô tình trở thành dữ liệu. Nếu cần giữ khoảng trắng cuối dòng có chủ ý, dùng ký tự thoát như `\s` hoặc cách biểu diễn rõ ràng.

### Dòng mới cuối cùng và dấu đóng

Hai cách đặt dấu đóng có thể cho kết quả khác về dòng mới cuối cùng:

```java
String withNewline = """
        hello
        """;

String withoutNewline = """
        hello""";
```

Khi đầu ra chính xác quan trọng, kiểm tra bằng `length()` hoặc hiển thị dạng có ký tự thoát thay vì chỉ nhìn mã nguồn bằng mắt.

### String.indent và stripIndent

Văn bản nhiều dòng không chỉ xuất hiện dưới dạng Text Block literal. `String` cũng có API để làm việc trực tiếp với thụt lề:

```java
String text = "alpha\nbeta\n";

String indented = text.indent(4);
String stripped = indented.stripIndent();
```

Mô hình tư duy:

```text
thụt lề phát sinh của Text Block
→ trình biên dịch xử lý khi tạo literal từ mã nguồn

String.indent / stripIndent
→ thao tác String khi chương trình chạy
```

Hai tầng này liên quan về mục đích xử lý văn bản nhiều dòng, nhưng không phải cùng một cơ chế.
