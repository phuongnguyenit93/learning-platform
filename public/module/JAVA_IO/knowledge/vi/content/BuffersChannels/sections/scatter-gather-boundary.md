Một số byte channel, trong đó có `FileChannel`, có thể đọc hoặc ghi **một mảng `ByteBuffer` trong một thao tác**.

**Scattering read** phân tán byte đọc được vào nhiều buffer theo thứ tự:

~~~java
ByteBuffer header = ByteBuffer.allocate(16);
ByteBuffer body = ByteBuffer.allocate(1024);

long read = channel.read(new ByteBuffer[]{header, body});
~~~

Channel đi qua các buffer theo thứ tự, điền buffer trước rồi tiếp tục sang buffer sau khi còn dữ liệu và còn chỗ. `position` của từng buffer tăng theo số byte thực tế mà buffer đó nhận.

**Gathering write** làm chiều ngược lại: lấy dữ liệu còn lại từ nhiều buffer theo thứ tự và ghi chúng thành một luồng byte trên channel:

~~~java
header.flip();
body.flip();

long written = channel.write(new ByteBuffer[]{header, body});
~~~

Mẫu này hữu ích khi dữ liệu tự nhiên có nhiều phần, ví dụ `header + payload`, vì mã không nhất thiết phải sao chép tất cả vào một Buffer lớn chỉ để thực hiện I/O.

Các quy tắc thao tác từng phần vẫn giữ nguyên. Giá trị trả về là **tổng số byte thực tế** đã chuyển, và một lần gọi có thể chưa tiêu thụ hết tất cả Buffer. Mã cần kiểm tra `position`/`hasRemaining()` của các Buffer và tiếp tục theo quy ước của Channel khi cần.

Scatter/gather cũng **không có nghĩa các buffer được đọc/ghi song song**. Đây vẫn là một thao tác trên một channel với nhiều vùng dữ liệu có thứ tự. Tính song song, lập lịch và phối hợp giữa nhiều task/thread là bài toán khác.
