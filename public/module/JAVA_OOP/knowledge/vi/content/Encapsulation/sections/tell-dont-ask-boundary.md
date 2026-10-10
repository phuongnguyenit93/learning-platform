### KHÁI NIỆM — “Tell, don't ask” muốn nói gì?

`Tell, don't ask` là một nguyên tắc gợi ý trong thiết kế OOP: thay vì lấy toàn bộ dữ liệu ra ngoài rồi tự quyết định, hãy yêu cầu đối tượng thực hiện hành vi thuộc trách nhiệm của nó.

Ví dụ quy tắc đang bị kéo ra ngoài đối tượng:

```java
if (account.getBalance() >= amount) {
    account.setBalance(account.getBalance() - amount);
}
```

Phiên bản thể hiện đúng ý định hơn:

```java
account.withdraw(amount);
```

Ở phiên bản thứ hai, bên gọi chỉ nói **muốn rút tiền**. Chính `Account` giữ quy tắc kiểm tra số dư.

### VÌ SAO — tránh lặp lại quy tắc ở nhiều nơi

Nếu nhiều đoạn mã cùng tự kiểm tra số dư, cùng tự tính toán và cùng tự cập nhật trường, quy tắc sẽ bị lặp lại.

Khi sau này thêm phí giao dịch hoặc số tiền dự phòng, tất cả những nơi đó đều phải sửa. Nếu quy tắc nằm trong `Account`, thay đổi có thể được khoanh vùng trong chính đối tượng này.

### ĐÁNH ĐỔI — không biến nguyên tắc thành luật tuyệt đối

Không phải lúc nào việc đọc dữ liệu cũng xấu. Báo cáo, tuần tự hóa (serialization) hoặc mô hình chỉ đọc thường cần lấy dữ liệu ra ngoài. DTO cũng không cần giả vờ thành một đối tượng miền giàu hành vi.

`Tell, don't ask` hữu ích nhất khi ta phát hiện **quy tắc nghiệp vụ đang nằm bên ngoài đối tượng sở hữu trạng thái**.

### MỐI LIÊN HỆ — từ đóng gói sang kế thừa

Khi một đối tượng đã có ranh giới và hợp đồng hành vi rõ ràng, câu hỏi tiếp theo xuất hiện:

> Nếu nhiều kiểu có chung một hợp đồng, hoặc một kiểu là dạng chuyên biệt của kiểu khác, Java biểu diễn mối quan hệ đó như thế nào?

Đó là lúc ta đi tới **kế thừa (inheritance)** và **kiểu con (subtyping)**.
