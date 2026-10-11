Giải tuần tự hóa bằng Java Object Serialization không giống việc đọc một cấu trúc dữ liệu thụ động đơn giản. Trong quá trình dựng đồ thị đối tượng, cơ chế tuần tự hóa khi chạy có thể kích hoạt hành vi đặc biệt của các lớp trên classpath, như `readObject`, `readResolve` tùy chỉnh và các **điểm móc xác thực (validation hook)**.

Vì vậy **không giải tuần tự hóa bằng Java Object Serialization từ nguồn không tin cậy**. Luồng byte do client tùy ý gửi, tệp tải lên không đáng tin hoặc thông điệp từ ranh giới bên ngoài không nên được đưa trực tiếp vào `ObjectInputStream.readObject()`.

Trong các **cuộc tấn công giải tuần tự hóa (deserialization attack)**, một **gadget** là lớp/phương thức đã có sẵn trên classpath có hành vi đặc biệt có thể bị lợi dụng khi đối tượng được dựng lại. Một **chuỗi gadget (gadget chain)** là nhiều gadget được dữ liệu độc hại kích hoạt nối tiếp để dẫn tới hành vi nguy hiểm. Đây là ý nghĩa của cụm “gadget/deserialization attack” khi nói về lịch sử rủi ro của Java Object Serialization.

~~~text
byte không tin cậy
    ↓
ObjectInputStream.readObject()
    ↓
dựng lại đồ thị đối tượng + điểm móc đặc thù của lớp
    ↓
rủi ro
~~~

`ObjectInputFilter` có thể giới hạn lớp, độ sâu đồ thị, số tham chiếu hoặc kích thước trong hệ thống bắt buộc phải hỗ trợ Java Object Serialization:

~~~java
ObjectInputFilter filter =
        ObjectInputFilter.Config.createFilter(
                "com.example.Note;java.base/*;!*"
        );

objectIn.setObjectInputFilter(filter);
~~~

Chuỗi bộ lọc trên cố ý khá rộng để minh họa: nó cho phép lớp `com.example.Note`, cho phép mọi lớp thuộc module `java.base`, rồi dùng `!*` để từ chối các lớp chưa khớp khác. Trong hệ thống thực tế, `ObjectInputFilter` nên chỉ cho phép các lớp/module thật sự cần cho đồ thị đối tượng mong đợi và thường cần thêm giới hạn phù hợp về độ sâu, số tham chiếu, độ dài mảng hoặc kích thước luồng. Bộ lọc phải được gắn vào `ObjectInputStream` **trước lần đọc đối tượng đầu tiên** như `readObject()` hoặc `readUnshared()`.

`ObjectInputFilter` là **lớp bảo vệ bổ sung (defense in depth)**, không biến việc giải tuần tự hóa dữ liệu Java Object Serialization không tin cậy thành lựa chọn mặc định được khuyến nghị.

Java Object Serialization cũng có các ranh giới ngoài bảo mật:

| Ranh giới | Hệ quả |
| --- | --- |
| Gắn với lớp Java/classpath | Khó làm quy ước giữa các ngôn ngữ khác nhau |
| Gắn với quá trình tiến hóa của lớp | Cần quản lý tương thích/phiên bản |
| Giao thức nhị phân khó quan sát | Khó gỡ lỗi/kiểm tra trực tiếp hơn định dạng văn bản/lược đồ (schema) |
| Dựng đồ thị đối tượng | Bề mặt hành vi khi chạy lớn hơn việc đọc DTO đơn giản |
| Lịch sử chuỗi gadget/tấn công giải tuần tự hóa | Dữ liệu đầu vào không tin cậy là rủi ro nghiêm trọng |

Với API mạng, quy ước thông điệp hoặc lưu trữ dài hạn, thường nên ưu tiên định dạng có quy ước rõ như JSON, Protocol Buffers hoặc định dạng/lược đồ phù hợp hệ thống, kết hợp DTO và quản lý phiên bản có chủ ý. Việc chọn định dạng cụ thể phụ thuộc bài toán, nhưng **Java Object Serialization không nên là khuyến nghị tổng quát**.

Nếu một cơ sở mã cũ đã dùng Java Object Serialization, cần biết cơ chế để đọc, bảo trì và thu hẹp ranh giới của nó. Chương cuối sẽ đặt cơ chế này bên cạnh luồng byte, Reader/Writer, `Files` và Channel để hình thành quy tắc chọn mức trừu tượng I/O đơn giản và đúng nhất.
