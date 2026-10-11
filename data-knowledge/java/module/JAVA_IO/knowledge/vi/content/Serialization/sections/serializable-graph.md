Tuần tự hóa không dừng ở đối tượng đầu tiên. Nó đi qua các đối tượng có thể truy cập được từ những trường tham gia tuần tự hóa.

Ví dụ:

~~~java
final class Author implements Serializable {
    private static final long serialVersionUID = 1L;
    String name;
}

final class Article implements Serializable {
    private static final long serialVersionUID = 1L;
    String title;
    Author author;
}
~~~

Khi tuần tự hóa một `Article`, đối tượng `Author` mà trường `author` trỏ tới cũng thuộc đồ thị cần tuần tự hóa. Nếu một đối tượng có thể truy cập được không hỗ trợ tuần tự hóa và trường đó không bị loại khỏi quá trình, cơ chế tuần tự hóa khi chạy có thể ném `NotSerializableException`.

Luồng đối tượng (`ObjectOutputStream`/`ObjectInputStream`) còn giữ quan hệ định danh trong đồ thị. Nếu hai trường cùng trỏ tới một đối tượng, giao thức có thể ghi tham chiếu tới đối tượng đã xuất hiện thay vì tạo hai đối tượng độc lập khi giải tuần tự hóa. Chu trình trong đồ thị vì thế cũng có thể được biểu diễn.

~~~text
Article A ─┐
           ├─→ cùng một đối tượng Author
Article B ─┘
~~~

Sau khi giải tuần tự hóa, quan hệ chia sẻ tham chiếu trong đồ thị được khôi phục theo giao thức.

Với một **lớp Serializable thông thường**, khi giải tuần tự hóa, **hàm tạo (constructor)** thông thường của chính lớp đó không được gọi như lúc ta dùng `new`. Lớp cha gần nhất không hỗ trợ tuần tự hóa cần một hàm tạo không tham số có thể truy cập để trạng thái lớp cha được khởi tạo theo quy tắc tuần tự hóa. Điều này cho thấy **giải tuần tự hóa (deserialization)** không chỉ là “đọc dữ liệu rồi gọi hàm tạo”.

**Record có thể tuần tự hóa là ngoại lệ được Java quy định riêng** cho quy tắc trên: khi giải tuần tự hóa record, Java dựng lại các giá trị **thành phần (component)** rồi gọi **hàm tạo chuẩn (canonical constructor)** của record. Record còn có thêm các quy tắc tuần tự hóa đặc biệt khác, vì vậy không nên áp mọi quy tắc về hàm tạo của lớp `Serializable` thông thường sang record.

Chính khả năng dựng lại cả đồ thị qua vòng đời đặc biệt này là lý do Java Object Serialization phải được xem như một ranh giới mạnh.
