Một số lỗi lặp lại trong Java networking đến từ mô hình tư duy sai hơn là cú pháp sai:

1. **Không đặt giới hạn thời gian ở thao tác có thể chờ**  
   Luồng xử lý request có thể giữ tài nguyên vô thời hạn khi remote peer không phản hồi.

2. **Coi TCP read = một message**  
   TCP chỉ là byte stream; framing phải do protocol/ứng dụng định nghĩa.

3. **Coi UDP connect = reliable connection**  
   DatagramSocket.connect chỉ gắn/lọc peer, không thêm bảo đảm giao nhận.

4. **Tuning socket option theo công thức**  
   Buffer, linger, keepalive và TCP_NODELAY chỉ có ý nghĩa khi biết bottleneck và hành vi của hệ điều hành.

5. **Nuốt IOException rồi retry vô hạn**  
   Unknown host, refused connection, timeout và response ứng dụng không hợp lệ không phải cùng một loại lỗi.

6. **Quên close hoặc trách nhiệm sở hữu không rõ**  
   Rò rỉ file descriptor/socket cuối cùng trở thành lỗi production.

7. **Mặc định non-blocking luôn tốt hơn**  
   Selector có chi phí quản lý trạng thái; Java 21 virtual threads làm phong cách blocking trở thành lựa chọn thực tế cho nhiều workload I/O-bound.

Chương tiếp theo chuyển từ lỗi/vòng đời sang NIO để hiểu khi nào độ phức tạp của channel/selector thật sự đáng dùng.
