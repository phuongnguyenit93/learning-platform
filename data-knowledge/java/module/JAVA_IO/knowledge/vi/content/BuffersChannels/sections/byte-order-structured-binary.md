`ByteBuffer` không chỉ đọc/ghi từng `byte`. Nó còn có các thao tác cho giá trị nguyên thủy nhiều byte như `putShort`, `putInt`, `putLong`, `putFloat`, `putDouble` và các `get...` tương ứng. Đây là cách tiện để xử lý **dữ liệu nhị phân có cấu trúc (structured binary)**: định dạng nhị phân trong đó từng vùng byte có ý nghĩa đã được quy định, ví dụ 4 byte đầu là phiên bản, 8 byte tiếp theo là dấu thời gian.

~~~java
ByteBuffer buffer = ByteBuffer.allocate(12);

buffer.putInt(3);
buffer.putLong(1_700_000_000L);

buffer.flip();

int version = buffer.getInt();
long timestamp = buffer.getLong();
~~~

Một `int` cần 4 byte, một `long` cần 8 byte. Khi nhiều byte cùng tạo thành một giá trị, mã phải biết **thứ tự byte (endianness)**: byte quan trọng nhất hay ít quan trọng nhất nằm trước trong dữ liệu.

`ByteBuffer` mới tạo có byte order mặc định là `ByteOrder.BIG_ENDIAN`:

~~~text
giá trị 0x01020304
BIG_ENDIAN    → 01 02 03 04
LITTLE_ENDIAN → 04 03 02 01
~~~

Nếu định dạng tệp hoặc giao thức quy định little-endian, phải đặt thứ tự byte trước khi đọc/ghi các giá trị nguyên thủy nhiều byte:

~~~java
ByteBuffer little = ByteBuffer
        .allocate(8)
        .order(ByteOrder.LITTLE_ENDIAN);

little.putInt(0x01020304);
~~~

Thứ tự byte là **một phần của quy ước dữ liệu**, không phải tùy chọn tối ưu hiệu năng. Đọc little-endian bằng big-endian vẫn có thể trả về một số hợp lệ về kiểu dữ liệu nhưng giá trị sẽ sai. Thứ tự byte không ảnh hưởng khi chỉ đọc/ghi từng byte riêng lẻ; nó quan trọng khi nhiều byte được ghép thành một giá trị nguyên thủy.

`ByteBuffer` cũng có thể tạo view theo kiểu như `asIntBuffer()` hoặc `asLongBuffer()`. View chia sẻ cùng vùng byte nhưng cho phép thao tác theo đơn vị `int`/`long`; thứ tự byte tại lúc tạo view quyết định cách các byte được diễn giải. Đây là công cụ hữu ích cho bố cục nhị phân dày đặc, nhưng mô hình gốc vẫn là: **vùng lưu byte + thứ tự byte + kiểu nguyên thủy mà định dạng quy định**.
