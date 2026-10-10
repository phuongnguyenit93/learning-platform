Đầu ra của transformer phải vượt qua nhiều lớp kiểm tra:

~~~text
định dạng class file hợp lệ
        ↓
phiên bản class file được hỗ trợ
        ↓
verification
        ↓
tên / hierarchy / ràng buộc cấu trúc
        ↓
linkage
        ↓
định nghĩa được cài
~~~

Các lỗi có thể xuất hiện dưới dạng:

- ClassFormatError;
- UnsupportedClassVersionError;
- NoClassDefFoundError nếu tên class không khớp;
- ClassCircularityError;
- LinkageError;
- UnsupportedOperationException cho thay đổi cấu trúc không được hỗ trợ.

Điểm quan trọng là ClassFileTransformer chạy **trước** verification. Thư viện bytecode tạo ra byte[] thành công không có nghĩa JVM sẽ chấp nhận định nghĩa.

Kiểm thử transformer phải gồm cả trường hợp thất bại, không chỉ kiểm tra “ASM/Byte Buddy không ném lỗi”.
