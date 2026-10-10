Các API tiện lợi như `readAllBytes` và `readString` rất tốt khi dữ liệu đầu vào **nhỏ và có giới hạn kích thước rõ ràng**:

~~~java
String config =
        Files.readString(path, StandardCharsets.UTF_8);
~~~

Ưu điểm là mã ngắn, dễ hiểu, dễ xử lý toàn bộ nội dung. Mô hình bộ nhớ quan trọng cần nhớ là **toàn bộ nội dung cần xử lý phải vừa trong bộ nhớ cùng lúc**:

~~~text
readAllBytes(tệp kích thước N)
→ trả về byte[] chứa toàn bộ tệp

readString(tệp)
→ trả về một String chứa toàn bộ văn bản sau giải mã
→ trong lúc giải mã, phần triển khai còn có thể cần bộ đệm byte/ký tự tạm thời
~~~

Nếu tệp có thể lớn, không tin cậy về kích thước hoặc đến từ nguồn dài liên tục, xử lý theo luồng (streaming) an toàn hơn về bộ nhớ:

~~~java
try (InputStream in = Files.newInputStream(path)) {
    byte[] buffer = new byte[8192];
    int read;

    while ((read = in.read(buffer)) != -1) {
        process(buffer, 0, read);
    }
}
~~~

Xử lý theo luồng không có nghĩa “không dùng buffer”. Thực tế mã thường xử lý **một vùng dữ liệu tạm có kích thước giới hạn** thay vì giữ toàn bộ nội dung cùng lúc.

~~~text
nạp toàn bộ
→ đơn giản
→ phù hợp dữ liệu nhỏ, có giới hạn rõ ràng

streaming
→ lượng bộ nhớ sử dụng được giới hạn theo từng khối
→ phù hợp dữ liệu lớn/không chắc kích thước
→ mã phải xử lý từng khối và trường hợp dữ liệu mới có một phần
~~~

Một lỗi phổ biến là dùng `readAllBytes()` cho tệp tải lên chỉ vì lúc thử trên máy cá nhân chỉ có tệp 20 KB. Khi môi trường thực tế nhận tệp 2 GB, lựa chọn API đã sai từ đầu.

Hãy xác định **giới hạn kích thước** của dữ liệu trước khi chọn API. “Tệp hiện tại nhỏ” khác với “quy ước của hệ thống đảm bảo tệp luôn nhỏ”.
