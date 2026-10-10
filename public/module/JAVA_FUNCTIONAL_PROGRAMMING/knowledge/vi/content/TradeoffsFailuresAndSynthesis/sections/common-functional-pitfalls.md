Nhiều lỗi lặp lại xuất phát từ việc đồng nhất cú pháp ngắn với thiết kế tốt:

- cho rằng mọi lambda đều thuần túy hoặc an toàn luồng;
- thay đổi đối tượng được bắt giữ rồi quên rằng các lần gọi sau cùng chia sẻ trạng thái đó;
- chọn sai thứ tự `compose`/`andThen` dù kiểu dữ liệu vẫn biên dịch;
- ép dùng tham chiếu phương thức khi lambda thể hiện ánh xạ đối số rõ hơn;
- che việc chuyển ngoại lệ được kiểm tra trong hàm hỗ trợ dùng chung khó nhìn thấy;
- gọi `Optional.get()` hoặc dùng `Optional` khắp nơi mà không có hợp đồng vắng mặt rõ ràng;
- tạo chuỗi dài đến mức khó gỡ lỗi và mất ý nghĩa nghiệp vụ;
- cho rằng biết lambda là đủ để suy ra cơ chế thực thi của Stream.

Cách sửa chung không phải là "tránh phong cách hàm", mà là giữ hợp đồng kiểu, trạng thái, tác dụng phụ, thứ tự thực thi và ranh giới mô-đun thật rõ ràng.
