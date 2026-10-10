TCP là full-duplex: hai chiều truyền có thể kết thúc độc lập. Java thể hiện khả năng này bằng `shutdownOutput()` và `shutdownInput()` trên `Socket`.

`shutdownOutput()` nói rằng endpoint local **không gửi thêm byte nữa**. Với TCP, các byte đã ghi trước đó được gửi, sau đó TCP thực hiện trình tự kết thúc bình thường cho chiều output. Peer vẫn có thể gửi dữ liệu ngược lại, và local socket vẫn có thể đọc dữ liệu đó.

Một cách dùng hữu ích là request có độ dài kết thúc bằng EOF của một chiều:

```java
try (Socket socket = new Socket("example.com", 8080)) {
    OutputStream out = socket.getOutputStream();
    out.write(requestBytes);
    out.flush();

    socket.shutdownOutput(); // báo: request đã gửi xong

    byte[] response = socket.getInputStream().readAllBytes();
    // Peer có thể gửi response rồi kết thúc chiều gửi của nó.
}
```

Điểm khác với `close()` là half-close vẫn giữ chiều còn lại hoạt động. Cũng vì vậy, **không đóng `OutputStream` để mô phỏng half-close**: theo contract của `Socket`, đóng stream trả về từ `getInputStream()` hoặc `getOutputStream()` sẽ đóng socket liên kết.

`shutdownInput()` đặt phía đọc local vào trạng thái end-of-stream; các lần đọc tiếp theo trả EOF theo contract của `Socket`. Đây là thao tác local cho chiều input, không phải cách gửi một message ứng dụng cho peer rằng "tôi không muốn nhận nữa". Thông thường protocol dùng `shutdownOutput()` để tạo tín hiệu EOF có ý nghĩa cho phía bên kia, còn `shutdownInput()` ít cần hơn trong mã ứng dụng.

Có thể kiểm tra trạng thái hai chiều bằng `isInputShutdown()` và `isOutputShutdown()`, nhưng các cờ này không thay thế việc xử lý EOF/`IOException` trong luồng I/O thực tế.
