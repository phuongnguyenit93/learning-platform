UDP bảo toàn **ranh giới datagram** tại API: một lần gửi tương ứng với một datagram, và một lần receive nhận một datagram (hoặc phần đầu của nó nếu buffer quá nhỏ). Điều đó không đồng nghĩa với bảo đảm giao hàng đáng tin cậy.

`DatagramSocket` không bổ sung các bảo đảm kiểu TCP cho ứng dụng:

- datagram có thể không đến;
- các datagram có thể đến khác thứ tự gửi;
- ứng dụng không nên dựa vào việc mỗi datagram chỉ xuất hiện đúng một lần nếu protocol của nó cần semantics chặt chẽ hơn;
- bên gửi không nhận được một acknowledgment ở cấp stream từ `DatagramSocket` để chứng minh ứng dụng phía peer đã xử lý message.

Do đó, nếu bài toán cần sequence number, acknowledgment, retry, phát hiện trùng lặp, thời hạn hiệu lực hoặc reassembly ở tầng ứng dụng, các quy tắc đó phải được protocol của ứng dụng định nghĩa rõ. JDK UDP API không tự biến UDP thành một phiên đáng tin cậy.

Ví dụ, một mẫu telemetry độc lập có thể chấp nhận mất một vài datagram và ưu tiên độ đơn giản/độ trễ. Ngược lại, một luồng công việc "mỗi command phải được xử lý đúng theo thứ tự" cần thêm semantics ở protocol hoặc một transport phù hợp hơn.

Điểm phân biệt cần giữ với TCP là:

```text
TCP -> byte stream có thứ tự; ứng dụng tự framing message
UDP -> có sẵn ranh giới datagram; ứng dụng tự xử lý reliability/order nếu cần
```
