### Bộ đếm có giới hạn biết trước

Yêu cầu:

```text
số nguyên
giá trị tối đa nhỏ hơn 2 tỷ
tràn số đồng nghĩa với lỗi chương trình
```

Lập luận:

```text
int
→ phạm vi đủ dùng
→ phép toán chính xác trong phạm vi đó
→ kiểm tra giới hạn hoặc dùng phép toán có kiểm tra khi không được phép tràn số
```

### Số đo khoa học

Yêu cầu:

```text
có phần thập phân
phạm vi động lớn
chấp nhận sai số biểu diễn nhỏ
```

Lập luận:

```text
double
→ chấp nhận biểu diễn nhị phân xấp xỉ
→ so sánh theo chiến lược sai số do bài toán quy định
→ xử lý NaN / vô cực nếu đầu vào hoặc phép toán có thể tạo ra chúng
```

### Tính toán tiền tệ

Yêu cầu:

```text
phải giữ đúng ý nghĩa thập phân
quy tắc làm tròn là một phần của nghiệp vụ
```

Lập luận:

```text
BigDecimal
→ khởi tạo từ ý nghĩa thập phân, không từ giá trị nhị phân đã có sai số
→ xác định scale / precision / ranh giới làm tròn
→ quyết định bằng nhau dựa trên cách biểu diễn hay giá trị số học
```

### Số nguyên vượt long

Yêu cầu:

```text
số nguyên
giá trị hợp lệ có thể vượt long
```

Lập luận:

```text
BigInteger
→ không có giới hạn tràn số độ rộng cố định đối với giá trị hợp lệ
→ phép toán dùng phương thức và trả về đối tượng mới
→ chuyển về kiểu nguyên thủy trở thành một ranh giới thu hẹp cần kiểm soát
```

### Giá trị ngẫu nhiên liên quan đến bảo mật

Yêu cầu:

```text
kẻ tấn công không được có khả năng dự đoán đầu ra tiếp theo
```

Lập luận:

```text
SecureRandom
→ tính khó dự đoán là một phần của yêu cầu
→ trong mã ứng dụng thông thường, để nền tảng/nhà cung cấp bảo mật (provider) quản lý việc khởi tạo seed
→ thiết kế giao thức mật mã được chuyển sang Security & Cryptography
```

Danh sách kiểm tra cuối cùng khi xử lý số:

```text
1. Giá trị này mang ý nghĩa gì?
2. Phạm vi hợp lệ là bao nhiêu?
3. Cần chính xác theo số nguyên, chính xác theo thập phân hay chỉ cần xấp xỉ?
4. Kiểu sai lệch hoặc lỗi nào được chấp nhận?
5. Quy tắc so sánh nào là đúng?
6. Được phép làm tròn ở đâu?
7. Việc chuyển đổi có đi qua ranh giới làm mất thông tin không?
8. Ngẫu nhiên chỉ phục vụ thống kê/tái lập hay liên quan đến bảo mật?
9. Vấn đề tiếp theo có thuộc một mô-đun Java khác không?
```

Khi trả lời được rõ ràng các câu hỏi này, hành vi xử lý số đang được thiết kế có chủ đích thay vì được lựa chọn theo phỏng đoán.
