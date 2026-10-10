Không phải mọi **trường của đối tượng (instance field)** đều nên đi vào dạng tuần tự hóa. Từ khóa `transient` loại một trường khỏi cơ chế tuần tự hóa mặc định:

~~~java
final class SessionSnapshot implements Serializable {
    private static final long serialVersionUID = 1L;

    String username;
    transient String temporaryToken;
}
~~~

Sau khi giải tuần tự hóa bằng cơ chế mặc định, trường `temporaryToken` nhận giá trị mặc định của kiểu, ở đây là `null`.

`transient` phù hợp với dữ liệu:

- có thể tính lại từ trường khác;
- chỉ có ý nghĩa trong lần chạy hiện tại;
- trỏ tới đối tượng không nên/không thể tuần tự hóa;
- không nên trở thành một phần của dạng dữ liệu đã tuần tự hóa.

Trường `static` là trạng thái cấp lớp chứ không phải trạng thái của từng đối tượng nên không thuộc trạng thái đối tượng được tuần tự hóa mặc định.

Không nên hiểu `transient` như một cơ chế bảo mật hoàn chỉnh. Nó chỉ nói trường nào không đi vào dạng tuần tự hóa mặc định. Nếu dữ liệu nhạy cảm được sao chép sang trường khác, cơ chế tuần tự hóa tùy chỉnh ghi nó ra, hoặc thiết kế tổng thể vẫn để bí mật xuất hiện ở thành phần khác, từ khóa này không giải quyết vấn đề.

Java còn cho phép tùy chỉnh `writeObject/readObject` và các **điểm mở rộng đặc biệt (hook)** liên quan. Các điểm mở rộng này tăng quyền kiểm soát nhưng cũng mở rộng bề mặt tương thích và bảo mật. Chỉ nên thêm khi thực sự cần một quy ước dạng tuần tự hóa có chủ ý.
