### Process là gì?

Process là một chương trình đang thực thi và có không gian tài nguyên riêng do hệ điều hành quản lý.

Ví dụ:

- IntelliJ IDEA đang chạy là một process.
- Một JVM chạy Spring Boot application là một process.
- Chrome có thể sử dụng nhiều process cho các tab hoặc thành phần khác nhau.

Các process được cách ly với nhau. Nếu muốn trao đổi dữ liệu, chúng thường phải sử dụng một cơ chế IPC như socket, pipe, file hoặc shared memory.

### Thread là gì?

Thread là một luồng thực thi bên trong process.

Một JVM process thường có nhiều thread cùng tồn tại:

```text
JVM Process
│
├── main thread
├── HTTP worker thread
├── GC thread
├── scheduler thread
└── các thread khác
```

Các thread trong cùng process có thể cùng truy cập những object nằm trong heap của process. Mỗi thread đồng thời có execution stack riêng để lưu call stack và dữ liệu local của lần thực thi đó.

Điều quan trọng là:

```text
Nhiều Thread
    ↓
có thể cùng truy cập Shared Mutable State
    ↓
Concurrency Problem có thể xuất hiện
```

Race condition, visibility, ordering và synchronization sẽ được học ở các phần sau. Ở phần Basic chỉ cần ghi nhớ rằng việc nhiều thread cùng nhìn thấy một object không đồng nghĩa việc truy cập object đó luôn an toàn.

### Process và Thread khác nhau ở đâu?

| Đặc điểm | Process | Thread |
| --- | --- | --- |
| Phạm vi | Một chương trình đang chạy | Một luồng thực thi bên trong process |
| Không gian bộ nhớ | Có không gian địa chỉ riêng | Cùng process nên có thể cùng truy cập heap |
| Stack | Process có thể chứa nhiều thread, mỗi thread có stack riêng | Mỗi thread có stack riêng |
| Giao tiếp | Thường cần IPC | Có thể giao tiếp thông qua shared object |
| Chi phí tạo/chuyển đổi | Thường lớn hơn thread | Thường nhẹ hơn process |
| Rủi ro concurrency | Cách ly tốt hơn giữa các process | Dễ phát sinh lỗi khi chia sẻ mutable state |

### Demo trong module

Tham khảo controller:

```text
BasicThreadController#processAndThread()
```

Endpoint:

```text
GET /basic/process-thread
```

Khi chạy endpoint này, response trả về:

- PID của JVM process hiện tại.
- Tên thread đang xử lý HTTP request.
- ID của thread đó.
- Thread đó có phải daemon hay không.
- Trạng thái hiện tại của thread.

Điểm cần quan sát là **một HTTP request không tự tồn tại độc lập**. Nó đang được thực thi bởi một thread cụ thể bên trong JVM process.

**Kết luận:** Process là phạm vi chứa tài nguyên và nhiều thread; Thread là execution flow đang thực sự chạy code bên trong process đó.
