Khi mã gọi một thao tác I/O, dữ liệu không nhất thiết đã sẵn sàng trong RAM. Chương trình có thể phải chờ hệ thống tệp, thiết bị hoặc đầu bên kia của kết nối mạng.

Với **I/O chặn (blocking I/O)** truyền thống, lời gọi như `read()` có thể chưa trả về ngay:

```text
gọi read()
    ↓
dữ liệu chưa có
    ↓
luồng thực thi gọi API chờ
    ↓
có dữ liệu / EOF / lỗi
    ↓
read() trả về hoặc ném ngoại lệ
```

**Luồng thực thi (thread)** là một dòng thực thi bên trong tiến trình. “Chặn” nghĩa là luồng thực thi gọi API phải chờ thao tác hoàn tất. Điều đó không có nghĩa CPU phải luôn bận quay vòng; JVM và hệ điều hành có thể tạm dừng luồng thực thi trong khi CPU làm việc khác.

Với **I/O không chặn (non-blocking I/O)**, thao tác được thiết kế để không giữ luồng thực thi gọi API đứng chờ cho tới khi tài nguyên sẵn sàng. Lời gọi có thể trả quyền điều khiển sớm để chương trình tiếp tục việc khác và phản ứng khi cơ chế báo sẵn sàng/sự kiện cho biết dữ liệu có thể được xử lý. Đây là khác biệt về cách chờ và phối hợp công việc, không phải lời hứa rằng mọi thao tác đều nhanh hơn.

**I/O bất đồng bộ (asynchronous I/O)** là một chiều khác: thao tác được khởi chạy trước, còn kết quả được nhận sau khi thao tác hoàn tất, chẳng hạn qua `Future` hoặc hàm gọi lại (callback). Vì vậy “bất đồng bộ” không đồng nghĩa với “không chặn”; cơ chế thực thi bên dưới có thể khác nhau tùy nền tảng. Chương `FileChannel` phía sau sẽ dùng `AsynchronousFileChannel` để làm rõ ranh giới này.

Điều này cũng tạo ra ranh giới hữu ích giữa **công việc thiên về CPU (CPU-bound)** và **công việc thiên về I/O (I/O-bound)**. Loại thứ nhất dành phần lớn thời gian cho tính toán trên CPU; loại thứ hai dành phần lớn thời gian chờ tệp, thiết bị, socket hoặc tài nguyên bên ngoài.

Không phải mọi API I/O của Java đều chặn. NIO còn có channel và các cơ chế không chặn cho những bài toán phù hợp. Các chương đầu chủ ý dùng luồng/tệp I/O đồng bộ để xây dựng mô hình nền tảng trước.
