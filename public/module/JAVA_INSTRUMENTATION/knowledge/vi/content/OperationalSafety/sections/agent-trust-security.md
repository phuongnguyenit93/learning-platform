Java Agent là mã đặc quyền trong tiến trình. Nó có thể thấy các class runtime, thay bytecode và chạy trong cùng miền bảo mật/lỗi với ứng dụng.

Vì vậy cần kiểm soát:

- artifact agent đến từ đâu;
- checksum/chữ ký/cố định phiên bản;
- ai được phép thêm -javaagent hoặc attach vào tiến trình;
- cấu hình/bí mật agent có thể đọc;
- telemetry agent gửi ra ngoài;
- dấu vết kiểm toán khi agent được bật/dynamic attach.

Đặc tả package java.lang.instrument đặt trách nhiệm xác minh độ tin cậy của agent lên lập trình viên hoặc quản trị viên triển khai agent.

Mô hình đe dọa thực tế:

~~~text
agent độc hại hoặc bị xâm phạm
→ quan sát/chỉnh sửa tùy ý trong cùng tiến trình
→ tác động tương đương một thành phần có đặc quyền cao
~~~

Đừng rà soát agent như một thư viện ghi log vô hại chỉ vì trường hợp sử dụng ban đầu là monitoring.
