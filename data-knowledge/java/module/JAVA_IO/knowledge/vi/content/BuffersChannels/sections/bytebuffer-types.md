Hai cách tạo `ByteBuffer` thường gặp:

~~~java
ByteBuffer heap = ByteBuffer.allocate(8192);
ByteBuffer direct = ByteBuffer.allocateDirect(8192);
~~~

`allocate` tạo **ByteBuffer trên heap**. Dữ liệu nằm trong vùng bộ nhớ do Java heap quản lý và, với Buffer phù hợp, có thể truy cập mảng nền (backing array) qua `array()`.

`allocateDirect` tạo **ByteBuffer trực tiếp (direct buffer)**. JVM cố gắng bố trí vùng nhớ để I/O ở tầng native có thể làm việc với nó hiệu quả hơn trong một số đường truyền dữ liệu, giảm một số bước sao chép trung gian.

Đánh đổi chính:

| Heap buffer | Direct buffer |
| --- | --- |
| Cấp phát thường rẻ hơn | Cấp phát/thu hồi thường đắt hơn |
| Thuận tiện cho mã Java thông thường | Có thể hữu ích khi buffer sống lâu và tham gia I/O lặp lại |
| Thường có backing array nếu không phải view đặc biệt | Không nên giả định có backing array |
| Dữ liệu nằm trên Java heap | Vùng lưu trữ có thể nằm ngoài heap Java được bộ thu gom rác quản lý; không giả định có mảng nền truy cập được |

ByteBuffer trực tiếp vẫn được đại diện bởi một đối tượng Java. Vùng lưu trữ phía sau do JVM quản lý và có thể nằm ngoài heap Java được bộ thu gom rác quản lý; Buffer không có `close()` công khai để mã ứng dụng giải phóng vùng nhớ đó một cách xác định theo ý muốn.

Không nên đổi mọi buffer sang direct chỉ vì tên nghe “nhanh hơn”. Với thao tác nhỏ hoặc buffer ngắn hạn, chi phí cấp phát có thể lấn át lợi ích. Chọn loại buffer dựa trên tải công việc và phép đo thực tế.

Buffer còn có các kiểu như `CharBuffer`, `IntBuffer`, nhưng với I/O byte qua tệp/mạng, `ByteBuffer` là kiểu trung tâm. Chương tiếp theo dùng chính mô hình này với `FileChannel` để thấy truy cập ngẫu nhiên, truyền dữ liệu, khóa tệp và ánh xạ bộ nhớ.
