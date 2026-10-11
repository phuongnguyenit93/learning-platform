`FileChannel.map` ánh xạ một vùng tệp vào không gian bộ nhớ và trả về `MappedByteBuffer`. Ví dụ dưới đây cố ý chỉ ánh xạ tối đa một cửa sổ 64 MiB:

Các chế độ chính là `READ_ONLY` (chỉ đọc), `READ_WRITE` (thay đổi có thể ghi về tệp) và `PRIVATE` (copy-on-write: thay đổi của tiến trình không trở thành thay đổi chung của tệp).

~~~java
long regionSize = Math.min(channel.size(), 64L * 1024 * 1024);

if (regionSize > 0) {
    MappedByteBuffer mapped = channel.map(
            FileChannel.MapMode.READ_ONLY,
            0,
            regionSize
    );

    byte first = mapped.get(0);
}
~~~

Ở đây, **bộ nhớ ảo (virtual memory)** là cơ chế của hệ điều hành ánh xạ không gian địa chỉ mà tiến trình nhìn thấy tới RAM và dữ liệu trên tầng lưu trữ. Hệ điều hành quản lý dữ liệu theo các khối gọi là **trang (page)**; khi mã truy cập một trang chưa có sẵn trong RAM, **lỗi trang (page fault)** xảy ra để hệ điều hành nạp hoặc ánh xạ trang cần thiết.

Mô hình cần nhớ:

~~~text
tệp trên tầng lưu trữ
↕ cơ chế bộ nhớ ảo của hệ điều hành
MappedByteBuffer
↕
mã Java đọc/ghi như một Buffer
~~~

Ánh xạ bộ nhớ có thể hữu ích với tệp lớn cần truy cập ngẫu nhiên nhiều vùng vì hệ điều hành quản lý việc nạp trang khi cần. Nhưng chi phí I/O không biến mất; nó chỉ xuất hiện qua cơ chế bộ nhớ ảo, ví dụ lỗi trang khi một trang chưa có trong RAM.

Các ranh giới cần nhớ:

- Vùng ánh xạ có offset và kích thước cụ thể; mã vẫn phải kiểm soát phạm vi.
- Với `FileChannel.map(MapMode, long, long)`, một vùng ánh xạ đơn lẻ không thể vượt quá `Integer.MAX_VALUE` byte vì `MappedByteBuffer` dùng chỉ số/capacity kiểu `int`; tệp lớn hơn có thể cần được ánh xạ theo nhiều cửa sổ. Đây là giới hạn của API, không phải đặc điểm riêng của Java 21.
- Sau khi tạo thành công, vùng ánh xạ tồn tại độc lập với việc `FileChannel` còn mở hay đã đóng; đóng channel **không tự hủy ánh xạ hoặc làm `MappedByteBuffer` đã tạo mất hiệu lực**.
- Nếu tệp bị cắt ngắn hoặc thay đổi đồng thời bởi thành phần khác, việc truy cập vùng đã ánh xạ có thể tạo lỗi hoặc hành vi phụ thuộc hệ thống.
- `MappedByteBuffer` không có API `close()` tiêu chuẩn để ứng dụng chủ động hủy ánh xạ chính xác tại một dòng lệnh; vòng đời vùng ánh xạ vì thế kém trực tiếp hơn channel.
- Với vùng ánh xạ `READ_WRITE`, `force()` yêu cầu đẩy các thay đổi xuống thiết bị lưu trữ chứa tệp ánh xạ; JDK đưa ra cam kết mạnh nhất khi tệp nằm trên thiết bị lưu trữ cục bộ. `force()` **không có tác dụng** với ánh xạ `READ_ONLY` hoặc `PRIVATE`, vì vậy ánh xạ `PRIVATE` theo cơ chế copy-on-write không được xem như vùng ánh xạ ghi bền vững trở lại tệp.
- Ánh xạ thường phù hợp hơn khi tải công việc thực sự có truy cập ngẫu nhiên lớn; với tệp nhỏ hoặc đọc tuần tự, stream/channel thông thường đơn giản hơn.

Ánh xạ bộ nhớ vì thế là công cụ chuyên biệt, không phải mặc định cho mọi I/O tệp.
