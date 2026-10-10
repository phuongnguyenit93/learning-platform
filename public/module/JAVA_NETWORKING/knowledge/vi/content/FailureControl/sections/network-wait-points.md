Mã networking thường “treo” không phải vì JVM đứng, mà vì chương trình đang **chờ một điều kiện bên ngoài**. Các điểm chờ quan trọng gồm:

- hostname resolution;
- connect tới remote endpoint;
- ServerSocket.accept() chờ kết nối mới;
- InputStream.read() hoặc DatagramSocket.receive() chờ dữ liệu;
- selector hoặc cơ chế hoàn tất bất đồng bộ chờ readiness/completion theo mô hình khác.

Không có một “network timeout” duy nhất bao phủ toàn bộ chuỗi:

~~~text
resolve
  ↓
connect
  ↓
request / write
  ↓
read / receive
  ↓
close
~~~

Mỗi giai đoạn có API và kiểu lỗi riêng. Ví dụ Socket.connect(address, timeout) giới hạn connect, còn Socket.setSoTimeout(...) giới hạn blocking read; ServerSocket.setSoTimeout(...) giới hạn accept.

Khi thiết kế timeout, trước tiên hãy xác định **đang muốn giới hạn thời gian của giai đoạn nào**. Một con số timeout áp vào sai ranh giới vừa không giải quyết được việc chờ kéo dài thật sự, vừa khiến việc gỡ lỗi khó hơn.
