Các hành động này khác nhau.

### Dọn dẹp

```text
mục tiêu
→ giải phóng tài nguyên / hoàn tất dọn dẹp bắt buộc

công cụ
→ try-with-resources
→ finally khi phù hợp
```

Dọn dẹp không có nghĩa thao tác đã phục hồi.

### Phục hồi

Phục hồi nghĩa là có một chiến lược thực sự tạo ra kết quả hợp lệ để thao tác có thể tiếp tục hoặc kết thúc đúng hợp đồng.

Ví dụ:

```text
file cấu hình chính không tồn tại
→ dùng cấu hình mặc định mà hợp đồng cho phép
```

Bắt exception rồi trả một giá trị tùy ý không phải phục hồi nếu bên gọi không thể phân biệt dữ liệu thật với dữ liệu giả.

### Thử lại

Thử lại chỉ có ý nghĩa khi lỗi có khả năng **tạm thời** và thao tác an toàn để thực hiện lại.

Trước khi thử lại, hỏi:

```text
Lỗi có tính tạm thời (transient) không?
Thao tác có tính idempotent hoặc có cơ chế chống tác dụng phụ bị lặp không?
Số lần thử lại có giới hạn không?
Có chính sách tăng thời gian chờ giữa các lần thử (backoff), hủy hoặc giới hạn thời gian (timeout) không?
```

Không nên:

```java
while (true) {
    try {
        sendPayment();
        break;
    } catch (Exception ex) {
        // thử lại vô hạn
    }
}
```

Thử lại vô hạn có thể biến một lỗi thành tình trạng quá tải và nhân lên các tác dụng phụ.

Trong module Java Core này, điểm cần nhớ là **thử lại là một chính sách xử lý tại ranh giới có đủ ngữ cảnh**, không phải phản xạ mặc định cho mọi exception.

### Lan truyền

Nếu tầng hiện tại không thể:

- phục hồi;
- chuyển đổi hữu ích;
- bổ sung ngữ cảnh cần thiết;
- kết thúc thao tác;
- dọn dẹp tài nguyên nó sở hữu;

thì để exception tiếp tục lan truyền có thể là lựa chọn đúng.

### Mô hình ra quyết định

```text
Exception tới tầng hiện tại
        ↓
Tôi có sở hữu tài nguyên cần dọn dẹp không?
        → có: dọn dẹp an toàn

Tôi có thể tạo ra kết quả phục hồi hợp lệ không?
        → có: phục hồi

Lỗi có tính tạm thời và việc thử lại có an toàn không?
        → có: thử lại theo chính sách có giới hạn

Mức trừu tượng có đổi ở đây không?
        → có: chuyển đổi + giữ cause

Đây có phải ranh giới cuối của yêu cầu/tác vụ không?
        → có: ánh xạ kết quả + ghi log/quan sát phù hợp

Không có trách nhiệm nào ở trên?
        → tiếp tục lan truyền
```

Chương cuối sẽ nối các quyết định này thành một mô hình xử lý lỗi xuyên suốt từ nơi phát sinh đến nơi chịu trách nhiệm xử lý cuối cùng.
