# hashCode và tra cứu dựa trên mã băm

`equals` trả lời chính xác hai đối tượng có bằng nhau không, nhưng nếu một `HashMap` phải gọi `equals` với mọi khóa thì việc tìm kiếm sẽ rất tốn chi phí. `hashCode` cung cấp một đầu vào nhanh để cấu trúc dữ liệu dựa trên mã băm thu hẹp nhóm ứng viên có thể cần kiểm tra bằng `equals`.

Quan trọng: `hashCode` **không thay thế `equals`**. Nó chỉ giúp thu hẹp nhóm ứng viên cần kiểm tra hiệu quả hơn.
