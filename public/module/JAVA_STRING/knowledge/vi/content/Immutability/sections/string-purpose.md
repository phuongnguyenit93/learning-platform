`String` là lớp trong `java.lang` dùng để biểu diễn **một giá trị văn bản** trong chương trình Java. Nó là một kiểu tham chiếu, không phải kiểu nguyên thủy. Một `String` có thể mang những nội dung như tên người dùng, thông báo, đường dẫn, mã định danh dạng văn bản, nội dung yêu cầu/phản hồi của API hoặc một đoạn cấu hình. Ở mức API Java, ta làm việc với một chuỗi văn bản; chi tiết về đơn vị mã UTF-16 (code unit), điểm mã Unicode (code point) và ký tự người dùng nhìn thấy sẽ được tách riêng ở các chương sau.

Văn bản cần một kiểu biểu diễn riêng vì nó có những quy tắc khác dữ liệu số hoặc đối tượng nghiệp vụ: ta cần so sánh nội dung, tìm kiếm, cắt ghép, chuẩn hóa, xử lý Unicode, chuyển đổi giữa văn bản và byte, rồi truyền qua nhiều ranh giới hệ thống. Vì vậy `String` xuất hiện rất thường xuyên ở nhập/xuất dữ liệu, giao diện người dùng (UI), tên và mã định danh dạng văn bản, nội dung hoặc tiêu đề (header) của API, bản ghi log, cấu hình, lưu trữ và dữ liệu truyền qua mạng/giao thức.

Điều đó không có nghĩa mọi dữ liệu nên được biến thành String. Số tiền, thời gian, trạng thái hay mã định danh nghiệp vụ thường nên giữ kiểu có ý nghĩa riêng trong logic nghiệp vụ; `String` phù hợp khi dữ liệu thực sự là văn bản hoặc khi một ranh giới yêu cầu biểu diễn dưới dạng văn bản.

`String` là kiểu biểu diễn văn bản quan trọng nhất trong Java, nhưng văn bản không đơn giản chỉ là “một mảng char”. Ta cần phân biệt ba tầng: **giá trị String trong JVM, mô hình Unicode dùng để biểu diễn ký tự, và cách văn bản được mã hóa thành byte khi đi qua ranh giới bên ngoài JVM**.

Tính bất biến (**immutability**) là nền tảng nối các chủ đề đó lại với nhau. Vì một đối tượng `String` không thay đổi nội dung sau khi được tạo, Java có thể chia sẻ **String literal** (chuỗi được viết trực tiếp trong mã nguồn, ví dụ `"java"`) trong String Pool, dùng String làm khóa băm ổn định và truyền String giữa nhiều nơi mà không lo một nơi khác sửa trực tiếp nội dung đối tượng đó.

Vì vậy mô-đun đi từ việc hiểu `String` và tính bất biến, tới String Pool và so sánh nội dung, rồi các thao tác String, chi phí nối chuỗi, `StringBuilder`/`StringBuffer` và `intern()`. Sau đó người học mới đi sâu vào mô hình Unicode, chuyển đổi văn bản ↔ byte bằng Charset, biểu thức chính quy và cuối cùng là cách biểu diễn String nhiều dòng trong mã nguồn.

Lộ trình:

```text
String là gì và vì sao Java cần một kiểu riêng để biểu diễn văn bản?
Khái niệm String
        ↓
Giá trị String có thay đổi tại chỗ không?
Tính bất biến
        ↓
Vì sao literal có thể dùng chung tham chiếu?
String Pool và định danh tham chiếu
        ↓
So sánh String theo tham chiếu hay nội dung?
So sánh String
        ↓
Đọc, tìm, cắt và biến đổi String bằng API nào?
Các thao tác String cốt lõi
        ↓
Nối String nhiều lần tạo chi phí gì?
Nối chuỗi → StringBuilder → StringBuffer → intern()
        ↓
Vì sao char không luôn là một ký tự người dùng nhìn thấy?
Unicode / điểm mã / cụm ký tự
        ↓
Văn bản Unicode biến thành byte bằng cách nào?
Mã hóa văn bản / Charset
        ↓
Mô tả mẫu văn bản bằng gì?
Regex
        ↓
Viết String nhiều dòng trong mã nguồn ra sao và kết nối toàn bộ mô hình thế nào?
Text Block và tổng hợp
```
