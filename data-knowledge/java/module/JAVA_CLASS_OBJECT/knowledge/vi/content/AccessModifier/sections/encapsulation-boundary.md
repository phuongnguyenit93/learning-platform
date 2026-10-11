`private` không tự động tạo thiết kế tốt, nhưng kiểm soát truy cập là công cụ quan trọng để giảm mức phụ thuộc giữa các phần mã.

Một nguyên tắc thực dụng:

```text
thành viên không cần public
→ đừng public chỉ để “tiện gọi”

trạng thái có điều kiện hợp lệ cần bảo vệ
→ hạn chế việc thay đổi trực tiếp từ bên ngoài
```

Phạm vi API công khai càng nhỏ thì càng ít bên gọi phụ thuộc trực tiếp vào chi tiết cách triển khai.
