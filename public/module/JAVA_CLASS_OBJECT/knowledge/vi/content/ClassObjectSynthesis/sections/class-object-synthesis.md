Chuỗi suy nghĩ đã xuất hiện ở cuối chương về tính bất biến được chuyển về đây và mở rộng thành bức tranh đầy đủ:

```text
lớp (class) định nghĩa trạng thái và hành vi
        ↓
hàm khởi tạo (constructor) tạo trạng thái hợp lệ
        ↓
this / super nối ngữ cảnh đối tượng hiện tại với phần lớp cha
        ↓
từ bổ nghĩa truy cập kiểm soát ranh giới truy cập
        ↓
static / thành viên của từng đối tượng / final phân biệt quyền sở hữu và khả năng gán lại
        ↓
khởi tạo lớp và khởi tạo từng đối tượng quyết định thời điểm trạng thái sẵn sàng
        ↓
lớp lồng nhau / lớp nội bộ tổ chức kiểu và có thể giữ ngữ cảnh bao quanh
        ↓
Object cung cấp lớp gốc và hành vi nền chung
        ↓
enum mô hình tập giá trị hữu hạn có kiểu
        ↓
sao chép tham chiếu / sao chép nông / sao chép sâu quyết định phần trạng thái nào được dùng chung
        ↓
trạng thái có thể thay đổi dùng chung làm quan hệ sở hữu trở nên quan trọng
        ↓
tính bất biến / sao chép phòng vệ giúp việc dùng chung an toàn hơn
```

Nhìn theo vòng đời sử dụng, **lớp được định nghĩa → bộ nhớ được cấp phát và trạng thái được khởi tạo trong quá trình tạo đối tượng → hàm khởi tạo hoàn tất → đối tượng trở nên sử dụng được → được truy cập → chia sẻ → sao chép → bảo vệ trạng thái**. Khi đọc một đoạn mã Java dùng nhiều đối tượng, có thể lần lượt hỏi:

1. Lớp này định nghĩa trạng thái và hành vi nào?
2. Hàm khởi tạo bảo đảm trạng thái hợp lệ ra sao?
3. Thành viên nào thuộc lớp, thành viên nào thuộc từng đối tượng, và ai được truy cập?
4. Trạng thái được khởi tạo theo thứ tự nào?
5. Có bao nhiêu tham chiếu đang trỏ tới cùng một đối tượng hoặc cùng trạng thái con?
6. Thao tác “sao chép” thực sự tạo đối tượng mới hay chỉ sao chép tham chiếu?
7. Bên gọi có thể thay đổi trạng thái nội bộ ngoài ý muốn không?
