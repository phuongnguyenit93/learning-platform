Một lời gọi `read(buffer)` **không hứa sẽ lấp đầy bộ đệm**. Nó có thể trả về ít byte hơn kích thước mảng dù luồng chưa EOF. Điều này rất quan trọng với mạng, luồng nén, pipe và các nguồn có dữ liệu đến theo từng đợt.

Vì vậy nếu định dạng yêu cầu **đúng một số byte xác định**, mã phải tự lặp hoặc dùng API có quy tắc hoàn tất phù hợp. `readNBytes(...)` tự thực hiện nhiều lần đọc cho tới tối đa độ dài yêu cầu, nhưng nếu gặp EOF sớm nó vẫn có thể trả số lượng nhỏ hơn yêu cầu, nên mã phải kiểm tra giá trị trả về. `DataInput.readFully(...)`, được giới thiệu bên dưới cho dữ liệu nhị phân có cấu trúc, sẽ ném `EOFException` nếu không lấy đủ số byte cần thiết.

Một vòng lặp thủ công để yêu cầu đủ byte có dạng:

```java
byte[] header = new byte[8];
int offset = 0;

while (offset < header.length) {
    int count = in.read(header, offset, header.length - offset);
    if (count == -1) {
        throw new java.io.EOFException("Thiếu dữ liệu header");
    }
    offset += count;
}
```

Ở phía `OutputStream`, quy tắc khác với đọc theo khối. `write(byte[])` và `write(byte[], off, len)` có trách nhiệm ghi vùng byte được yêu cầu hoặc báo lỗi bằng ngoại lệ. Không nên áp mô hình “một lần ghi có thể báo đã ghi một phần” của `Channel` vào `OutputStream`; thao tác ghi từng phần theo số lượng trả về sẽ xuất hiện rõ hơn khi học channel của NIO.

`write(int value)` chỉ ghi 8 bit thấp của `value`, nên khi muốn ghi nhiều byte ta thường dùng **nạp chồng (overload)** nhận mảng. Nạp chồng nghĩa là nhiều phương thức cùng tên nhưng có danh sách tham số khác nhau.
