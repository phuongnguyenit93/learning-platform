`AsynchronousFileChannel` vẫn là channel dành cho tệp, nhưng thao tác đọc/ghi của nó được **khởi chạy rồi hoàn tất bất đồng bộ** thay vì buộc bên gọi chờ ngay tại lời gọi `read` hoặc `write`.

Khác với `FileChannel`, API này không dựa vào một vị trí tệp dùng chung có thể thay đổi. Mỗi lần đọc/ghi chỉ rõ offset trong tệp:

~~~java
try (AsynchronousFileChannel channel =
             AsynchronousFileChannel.open(path, StandardOpenOption.READ)) {
    ByteBuffer buffer = ByteBuffer.allocate(4096);
    Future<Integer> pending = channel.read(buffer, 0);

    // Chương trình có thể làm việc khác ở đây.
    int read = pending.get();
}
~~~

`Future<Integer>` là một cách nhận kết quả. Gọi `get()` sẽ chờ nếu thao tác chưa hoàn tất, nên nếu mã gọi `get()` ngay sau `read(...)`, lợi ích của việc tách thời điểm khởi chạy và thời điểm chờ gần như mất đi.

API còn hỗ trợ `CompletionHandler`, nơi Java gọi hàm callback khi thao tác thành công hoặc thất bại:

~~~java
channel.read(buffer, 0, null,
        new CompletionHandler<Integer, Void>() {
            @Override
            public void completed(Integer count, Void ignored) {
                // dùng kết quả sau khi read hoàn tất
            }

            @Override
            public void failed(Throwable error, Void ignored) {
                // xử lý lỗi
            }
        });
~~~

Ghi cũng có hai cách tương tự và luôn nhận một vị trí tệp rõ ràng. Giống channel đồng bộ, số byte hoàn tất có thể nhỏ hơn số byte còn lại trong buffer, nên xử lý nhiều bước vẫn phải dựa trên số lượng/`position` thực tế thay vì giả định một thao tác xử lý toàn bộ dữ liệu.

Vòng đời vẫn phải rõ ràng: `AsynchronousFileChannel` là `AutoCloseable`; bên sở hữu phải giữ channel mở đủ lâu cho những thao tác mà ứng dụng còn cần và đóng nó khi kết thúc. Nếu đóng channel khi vẫn còn thao tác bất đồng bộ đang chờ, các thao tác đó hoàn tất với `AsynchronousCloseException`. Cũng không được sửa hoặc tái sử dụng vùng `ByteBuffer` đang tham gia một thao tác bất đồng bộ cho tới khi thao tác đó đã hoàn tất theo quy ước của ứng dụng.

Nhiều thao tác đọc/ghi có thể cùng ở trạng thái chưa hoàn tất. **JDK không quy định thứ tự hoàn tất I/O hoặc thứ tự các `CompletionHandler` được gọi**, và không đảm bảo chúng trùng với thứ tự khởi chạy. Nếu thuật toán cần thứ tự, mã phải tự tạo quy tắc phối hợp thay vì suy ra từ thứ tự gọi phương thức.

Hủy thao tác cũng là vấn đề của I/O, không chỉ là hành vi chung của `Future`. Gọi `cancel(true)` có thể ngắt thao tác bằng cách **đóng channel**; khi đó các thao tác bất đồng bộ khác còn đang chờ trên cùng channel có thể thất bại với `AsynchronousCloseException`. Nếu phần triển khai không thể khẳng định byte đã được đọc/ghi tới đâu trước lúc hủy, trạng thái sau hủy phụ thuộc phần triển khai; vì vậy không được coi buffer/trạng thái của thao tác bị hủy như thể “chưa có gì xảy ra”.

Ranh giới lựa chọn:

~~~text
FileChannel
→ bên gọi thực hiện I/O tệp đồng bộ/blocking
→ luồng điều khiển thường đơn giản hơn

AsynchronousFileChannel
→ thao tác có thể hoàn tất sau
→ phù hợp khi kiến trúc thực sự tận dụng thời gian chờ để làm việc khác
→ cách hoàn tất, hủy và phối hợp trở thành một phần của thiết kế
~~~

I/O bất đồng bộ không tự động làm chương trình nhanh hơn và cũng không tự giải quyết truy cập đồng thời. Khi nhiều thao tác chồng lấn trên cùng vùng tệp hoặc cùng dữ liệu trong bộ nhớ, ứng dụng vẫn phải định nghĩa cách phối hợp rõ ràng. Executor, ghép callback, hủy thao tác, khả năng nhìn thấy thay đổi bộ nhớ và các mô hình đồng thời sâu hơn thuộc module Concurrency; ở đây điều cần nắm là quy ước I/O bất đồng bộ và vòng đời của channel/buffer.

Sau `FileChannel` và `AsynchronousFileChannel`, ta đã gặp nhiều đối tượng gắn với tài nguyên bên ngoài JVM: stream, channel, `DirectoryStream` và `FileLock`. Chương tiếp theo tập trung vào câu hỏi thiết kế quan trọng hơn cú pháp: **ai sở hữu tài nguyên và khi nào tài nguyên phải được đóng?**
