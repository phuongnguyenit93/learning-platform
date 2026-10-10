Dữ liệu đã tuần tự hóa có thể tồn tại lâu hơn phiên bản lớp đã tạo ra nó. Java cần một cách kiểm tra lớp lúc đọc có tương thích với lớp lúc ghi hay không. `serialVersionUID` là mã định danh phiên bản phục vụ kiểm tra này:

~~~java
final class Note implements Serializable {
    private static final long serialVersionUID = 1L;

    String title;
    String body;
}
~~~

Với một **lớp Serializable thông thường**, nếu không khai báo `serialVersionUID`, cơ chế tuần tự hóa có thể tính UID từ chi tiết lớp. Khi lớp thay đổi, UID tính tự động có thể thay đổi theo những cách khiến dữ liệu cũ không đọc được.

Vì vậy lớp cố ý dùng Java Object Serialization thường khai báo UID rõ ràng:

~~~java
private static final long serialVersionUID = 1L;
~~~

Nhưng cần hiểu giới hạn: **giữ cùng UID không tự động làm mọi thay đổi lớp trở nên an toàn hoặc có nghĩa**. Nó chỉ là một phần của kiểm tra tương thích trong cơ chế tuần tự hóa. Thay đổi trường, hệ phân cấp, bất biến hoặc cơ chế tuần tự hóa tùy chỉnh vẫn có thể tạo dữ liệu không còn phù hợp về mặt nghiệp vụ dù cơ chế khi chạy không chặn ngay.

Ngược lại, đổi UID chủ động có thể dùng để tuyên bố dữ liệu tuần tự hóa cũ không còn tương thích; lúc đọc dữ liệu cũ, `InvalidClassException` có thể xuất hiện.

Record lại có ranh giới riêng: record hỗ trợ tuần tự hóa có `serialVersionUID` mặc định là `0L` nếu không tự khai báo, và Java **không yêu cầu UID trong luồng phải khớp UID của lớp record hiện tại**. Quy tắc đặc biệt này tiếp tục cho thấy Java Object Serialization có quy tắc phụ thuộc loại lớp, không phải một công thức áp dụng giống hệt cho mọi kiểu.

Vì dạng dữ liệu tuần tự hóa bị buộc vào quá trình tiến hóa của lớp, lưu Java Object Serialization như dữ liệu dài hạn nhiều năm thường tạo chi phí chuyển đổi và tương thích lớn hơn các định dạng có lược đồ (schema) hoặc quy ước được thiết kế rõ ràng.
