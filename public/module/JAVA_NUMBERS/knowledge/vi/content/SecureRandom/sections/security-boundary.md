Numbers chỉ cần giúp người học hiểu:

```text
Random
→ cơ chế giả ngẫu nhiên có tính xác định
→ kiểm thử/mô phỏng/tính ngẫu nhiên thông thường

SecureRandom
→ yêu cầu khó dự đoán trước kẻ tấn công
→ tính ngẫu nhiên nhạy cảm về bảo mật
```

Những chủ đề sâu hơn như:

- lựa chọn kích thước khóa;
- chế độ mã hóa (cipher mode);
- yêu cầu nonce không trùng lặp;
- cách tạo IV;
- cấu hình nhà cung cấp bảo mật (provider);
- chi tiết bên trong của nguồn entropy;
- thiết kế giao thức mật mã;

thuộc mô-đun Bảo mật và Mật mã học.

Đặc biệt, không nên kết luận rằng dùng `SecureRandom` là đủ để thiết kế hệ thống mật mã an toàn. `SecureRandom` chỉ giải quyết **nguồn ngẫu nhiên**; giao thức còn nhiều điều kiện bất biến khác.

Chương tổng hợp cuối cùng sẽ gom các lựa chọn trong Numbers lại thành một mô hình ra quyết định. Câu hỏi quan trọng khi gặp một con số là:

> cách biểu diễn và chính sách nào phù hợp với yêu cầu của bài toán: phạm vi, độ chính xác, ngữ nghĩa thập phân, làm tròn hay tính khó dự đoán?
