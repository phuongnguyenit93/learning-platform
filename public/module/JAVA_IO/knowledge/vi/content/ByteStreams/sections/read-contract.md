Điểm dễ sai nhất với `InputStream` là hiểu sai giá trị trả về.

`read()` không trả về `byte`; nó trả về `int`:

- `0..255`: giá trị của byte vừa đọc.
- `-1`: kết thúc luồng (end-of-stream, EOF), nghĩa là không còn byte nào.

Kiểu `int` cần thiết để giữ được cả 256 giá trị byte không dấu và thêm giá trị đặc biệt `-1`.

```java
try (java.io.InputStream in =
         new java.io.ByteArrayInputStream(new byte[] {10, 20})) {

    int first = in.read();   // 10
    int second = in.read();  // 20
    int eof = in.read();     // -1
}
```

Với `read(byte[] buffer)`, giá trị trả về là **số byte thực sự đã đặt vào bộ đệm**, hoặc `-1` nếu luồng đã ở EOF và không đọc được byte nào. Mã phải dùng con số này; không được mặc định toàn bộ bộ đệm đều chứa dữ liệu mới.

```java
byte[] buffer = new byte[4096];
int count;

while ((count = in.read(buffer)) != -1) {
    consume(buffer, 0, count);
}
```

`consume(...)` trong ví dụ chỉ là **hàm minh họa do ứng dụng tự viết** để xử lý `count` byte vừa đọc; nó không phải API của JDK.

Nếu truyền một vùng có độ dài bằng 0 thì thao tác đọc theo khối có thể trả `0`; với vùng có độ dài dương, vòng lặp thông thường xử lý `> 0` hoặc `-1`.

Hai nhóm API khác cũng dễ bị hiểu sai:

- `available()` **không trả “tổng số byte còn lại”**. Nó chỉ ước lượng số byte có thể đọc hoặc bỏ qua mà không bị chặn tại thời điểm gọi và hoàn toàn có thể trả `0`. Không dùng nó để suy ra kích thước toàn bộ luồng hoặc cấp phát bộ đệm cho toàn bộ dữ liệu.
- `mark(...)` / `reset()` chỉ dùng được khi luồng hỗ trợ. Hãy kiểm tra `markSupported()` trước khi dựa vào khả năng quay lại vị trí đã đánh dấu; `InputStream` cơ sở mặc định không hỗ trợ `reset()`.
