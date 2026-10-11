Sau khi `Socket` đã kết nối, `getInputStream()` cung cấp luồng byte đi **vào** endpoint local và `getOutputStream()` cung cấp luồng byte đi **ra** remote endpoint.

```java
InputStream in = socket.getInputStream();
OutputStream out = socket.getOutputStream();

out.write("PING\n".getBytes(StandardCharsets.UTF_8));
out.flush();

byte[] buffer = new byte[1024];
int read = in.read(buffer);
if (read == -1) {
    // peer đã kết thúc chiều gửi và mọi byte đã nhận được đã được đọc hết.
}
```

`read(byte[])` không hứa sẽ lấp đầy buffer. Nó có thể trả về ít byte hơn kích thước buffer ngay cả khi bên gửi đã gọi `write()` với một mảng lớn. Ngược lại, một lần `read()` cũng có thể nhận byte xuất phát từ nhiều lần `write()` trước đó. Đây là hệ quả trực tiếp của mô hình **byte stream**.

`write()` đưa byte vào cơ chế truyền của socket nhưng không biến mỗi lần gọi thành một message trên đường truyền. Nếu bọc socket bằng `BufferedOutputStream`, `BufferedWriter`, `DataOutputStream` hoặc writer khác, phải hiểu buffer của lớp bọc. `flush()` đặc biệt quan trọng khi lớp bọc đang giữ dữ liệu mà peer cần nhận trước khi có thể tiếp tục protocol.

Khi peer đóng bình thường chiều gửi và toàn bộ byte đã nhận đã được tiêu thụ, `InputStream.read()` trả `-1`. Giá trị `-1` là EOF của luồng, không phải một byte dữ liệu và không đồng nghĩa với "hiện tại chưa có dữ liệu".
