Networking cho phép một chương trình Java trao đổi dữ liệu với **một tiến trình khác thông qua một endpoint mạng**. Tiến trình kia có thể nằm cùng máy, trong cùng mạng nội bộ hoặc ở một hệ thống từ xa. Khác với đọc bộ nhớ hoặc file cục bộ, network I/O luôn đi qua ranh giới bên ngoài JVM: có độ trễ, phụ thuộc hệ điều hành, có thể thất bại giữa chừng và cần quản lý tài nguyên thật.

Nếu không có networking, ứng dụng chỉ có thể xử lý dữ liệu cục bộ hoặc phải dựa vào một cơ chế IPC khác. Networking giải quyết bài toán:

~~~text
hai phía độc lập
→ tìm thấy nhau
→ thiết lập cách giao tiếp
→ truyền dữ liệu
→ xử lý lỗi
→ giải phóng tài nguyên
~~~

JDK cung cấp nhiều mức trừu tượng (abstraction). Ở mức thấp có Socket, ServerSocket, DatagramSocket và các network channel. Ở mức cao hơn có HttpClient và WebSocket client. Mục tiêu của module không phải học thuộc class, mà hiểu **mỗi mức trừu tượng đang che giấu phần nào của bài toán mạng**.

Mô hình tư duy xuyên suốt module:

~~~text
nhu cầu giao tiếp của ứng dụng
    ↓
protocol / API abstraction
    ↓
endpoint + transport
    ↓
I/O mạng
    ↓
tiến trình từ xa
~~~

Khi gỡ lỗi mã mạng, bốn câu hỏi đầu tiên nên là: đang nói chuyện với endpoint nào, bằng transport nào, thao tác nào có thể đang chờ, và tài nguyên nào cần được đóng?
