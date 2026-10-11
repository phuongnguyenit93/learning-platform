Một mô hình tư duy đủ dùng:

```text
cấp phát bộ nhớ cho đối tượng
        ↓
trường nhận giá trị mặc định 0/null/false
        ↓
khởi tạo phần lớp cha
        ↓
khởi tạo trường / khối khởi tạo đối tượng
        ↓
thân hàm khởi tạo của lớp hiện tại
        ↓
tham chiếu được trả về cho bên gọi nếu quá trình khởi tạo thành công
```

Đừng nhầm “bộ nhớ đã được cấp phát” với “đối tượng đã ở trạng thái hợp lệ”. Các điều kiện hợp lệ chỉ nên được coi là hoàn tất sau khi chuỗi hàm khởi tạo kết thúc thành công.
