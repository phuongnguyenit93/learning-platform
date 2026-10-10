Toàn bộ module giờ nối thành một câu chuyện:

```text
trục vòng đời chính
bytecode
→ yêu cầu nạp đi qua quy tắc ưu tiên cha/ủy quyền và cách tìm kiếm của ClassLoader tùy chỉnh
→ một ClassLoader cuối cùng định nghĩa class có tên thông thường
→ tên nhị phân + ClassLoader định nghĩa xác lập định danh kiểu khi chạy
→ liên kết (linking) chuẩn bị kiểu cho việc sử dụng
→ sử dụng chủ động (active use) kích hoạt khởi tạo
→ đối tượng/class tồn tại khi vẫn còn được tham chiếu
→ class của ClassLoader tùy chỉnh chỉ có cơ hội được gỡ nạp khi đồ thị ClassLoader định nghĩa không còn được GC root giữ lại

cơ chế tìm kiếm/phát hiện chạy song song với trục vòng đời
TCCL
→ có thể cung cấp ngữ cảnh tìm kiếm khác để khung phần mềm thấy provider của ứng dụng/ClassLoader con

API tài nguyên của Class / ClassLoader
→ tìm tài nguyên trong không gian tên mà ClassLoader nhìn thấy
→ việc tìm tài nguyên không tự nó định nghĩa một class
```

Nếu giữ mô hình tư duy này, các lỗi ClassLoader không còn là một nhóm exception rời rạc. Chúng thường quay về bốn câu hỏi: **bytes được tìm bởi loader nào, type được định nghĩa bởi loader nào, thao tác đang dùng ngữ cảnh tìm kiếm nào, và tham chiếu nào vẫn giữ loader sống**.
