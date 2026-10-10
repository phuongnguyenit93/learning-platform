Luồng byte phù hợp khi nội dung cần được giữ ở dạng byte hoặc khi tầng hiện tại chưa nên quyết định cách mã hóa văn bản:

- ảnh, audio, video;
- tệp ZIP, PDF hoặc định dạng nhị phân;
- dữ liệu đã mã hóa/nén;
- sao chép dữ liệu nguyên trạng;
- giao thức mà bố cục byte có ý nghĩa riêng.

Ví dụ sao chép dữ liệu mà không diễn giải nó là văn bản:

```java
try (java.io.InputStream in = source();
     java.io.OutputStream out = destination()) {
    in.transferTo(out);
}
```

`source()` và `destination()` ở đây là **hàm minh họa do ứng dụng tự cung cấp** để đại diện cho mã lấy luồng thật từ tệp, socket hoặc nơi khác; chúng không phải phương thức có sẵn trong JDK.

`transferTo` vẫn làm việc theo quy tắc của luồng byte. Nó tiện cho trường hợp chuyển toàn bộ phần dữ liệu còn lại từ một luồng sang luồng khác, nhưng không thay đổi quy tắc sở hữu tài nguyên: đoạn mã nào tạo/sở hữu các luồng vẫn phải quyết định khi nào đóng chúng.

Khi dữ liệu thật sự là văn bản, xử lý trực tiếp từng byte khiến mã phải tự lo giải mã và dễ cắt sai ranh giới ký tự nhiều byte. Chương tiếp theo thêm mô hình `Reader`/`Writer` để đưa bộ mã ký tự vào đúng vị trí.
