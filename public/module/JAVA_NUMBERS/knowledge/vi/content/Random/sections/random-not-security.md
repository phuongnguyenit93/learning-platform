`Random` và `ThreadLocalRandom` không được thiết kế để chống kẻ tấn công dự đoán trạng thái/đầu ra.

Không dùng chúng cho:

- token đặt lại mật khẩu;
- bí mật của phiên;
- token xác thực;
- nonce mật mã;
- vật liệu tạo khóa;
- định danh nhạy cảm về bảo mật nếu tính khó dự đoán là một yêu cầu.

### Seed không phải mật khẩu

```java
new Random(System.currentTimeMillis())
```

không biến bộ sinh thành một nguồn an toàn. Mốc thời gian có khả năng dự đoán/không gian tìm kiếm khác hoàn toàn nguồn entropy mạnh.

Nếu kẻ tấn công không được phép dự đoán đầu ra tiếp theo, chương sau chuyển sang `SecureRandom`.
