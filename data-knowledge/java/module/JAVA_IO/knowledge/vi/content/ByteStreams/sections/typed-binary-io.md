Luồng byte thô chỉ biết “đây là các byte”. Nhiều định dạng nhị phân lại cần quy tắc chặt chẽ hơn, ví dụ:

```text
4 byte  → số lượng bản ghi
8 byte  → dấu thời gian kiểu long
1 byte  → cờ boolean
N byte  → phần dữ liệu tiếp theo
```

`DataInput` và `DataOutput` là hai giao diện mô tả việc đọc/ghi các kiểu nguyên thủy Java theo một quy tắc nhị phân xác định. `DataInputStream` bọc một `InputStream` để cung cấp `DataInput`; `DataOutputStream` bọc một `OutputStream` để cung cấp `DataOutput`.

```text
InputStream  → DataInputStream  → readInt/readLong/readBoolean/...
OutputStream → DataOutputStream → writeInt/writeLong/writeBoolean/...
```

Ví dụ một định dạng nhỏ tự định nghĩa thứ tự trường là `int version` → `long id` → `boolean active`:

```java
byte[] encoded;

try (java.io.ByteArrayOutputStream bytes = new java.io.ByteArrayOutputStream();
     java.io.DataOutputStream out = new java.io.DataOutputStream(bytes)) {

    out.writeInt(1);
    out.writeLong(42L);
    out.writeBoolean(true);
    encoded = bytes.toByteArray();
}

try (java.io.DataInputStream in = new java.io.DataInputStream(
        new java.io.ByteArrayInputStream(encoded))) {

    int version = in.readInt();
    long id = in.readLong();
    boolean active = in.readBoolean();
}
```

Các phương thức số nguyên của `DataOutput` ghi byte theo **big-endian** (byte quan trọng hơn trước), và `DataInput` đọc lại theo cùng quy tắc. Nhưng API không tự biết “trường nào đứng trước trường nào”. **Bên ghi và bên đọc phải thống nhất chính xác về lược đồ và cách xác định ranh giới dữ liệu (schema/framing)**: thứ tự trường, kiểu trường, phiên bản, độ dài và nơi một bản ghi kết thúc. Nếu bên ghi ghi `long` trước nhưng bên đọc gọi `readInt()` trước, luồng vẫn chỉ là byte; Java không có siêu dữ liệu để tự sửa sai định dạng.

Với trường có độ dài cố định, `readFully(byte[])` hữu ích khi định dạng yêu cầu **đúng N byte**. Phương thức này tiếp tục đọc cho tới khi mảng được lấp đầy; nếu EOF xuất hiện trước khi đủ dữ liệu, nó ném `EOFException`:

```java
byte[] magic = new byte[4];
in.readFully(magic); // hoặc đủ 4 byte, hoặc EOFException
```

Các phương thức như `readInt()`, `readLong()` cũng ném `EOFException` nếu luồng kết thúc giữa giá trị nguyên thủy đang đọc. Điều này khác với `InputStream.read(...)`, nơi bên gọi nhận số byte thực tế và tự quyết định có cần đọc tiếp hay không.

Một định dạng nhị phân có bản ghi độ dài biến đổi thường phải có **quy tắc xác định ranh giới dữ liệu (framing)**, ví dụ ghi độ dài trước phần dữ liệu:

```java
byte[] payload = ...;
out.writeInt(payload.length);
out.write(payload);

int length = in.readInt();
if (length < 0 || length > 1_000_000) {
    throw new java.io.IOException("Độ dài payload không hợp lệ: " + length);
}
byte[] payloadRead = new byte[length];
in.readFully(payloadRead);
```

Việc kiểm tra độ dài trước khi cấp phát bộ nhớ rất quan trọng khi dữ liệu đến từ nguồn không tin cậy; một giá trị độ dài tùy ý không nên được phép ép chương trình cấp phát bộ nhớ không giới hạn.

`writeUTF(String)` / `readUTF()` là một trường hợp đặc biệt cần nhớ. Chúng **không dùng UTF-8 chuẩn như `StandardCharsets.UTF_8`**; chúng dùng định dạng **modified UTF-8** của `DataInput`/`DataOutput` và đặt độ dài không dấu 16 bit ở trước chuỗi. Vì vậy dạng mã hóa bị giới hạn khoảng 65.535 byte và không nên được coi là định dạng UTF-8 thông thường để trao đổi tùy ý với hệ thống khác. Nếu định dạng yêu cầu UTF-8 chuẩn, hãy tự mã hóa bằng `StandardCharsets.UTF_8` và thiết kế ranh giới/độ dài rõ ràng.

I/O nhị phân có cấu trúc cũng **khác tuần tự hóa đối tượng Java**. `DataInputStream`/`DataOutputStream` chỉ ghi các giá trị nguyên thủy/byte theo lược đồ do ứng dụng tự định nghĩa; chúng không tự ghi siêu dữ liệu lớp hay đồ thị đối tượng. Tuần tự hóa sẽ là một chương riêng ở phía sau.
