Transformer chạy trong đường định nghĩa class, nên code nó gọi có thể vô tình kích hoạt thêm quá trình nạp class.

Ví dụ:

~~~text
transform OrderService
→ lần đầu dùng logger
→ nạp hiện thực Logger
→ transformer gặp class Logger
→ code biến đổi lại ghi log
→ nạp đệ quy / vấn đề phụ thuộc
~~~

Java API loại trừ một số lần định nghĩa class mà transformer phụ thuộc, nhưng agent vẫn phải thiết kế để tránh đệ quy rộng hơn.

Các biện pháp:

- nạp/khởi tạo helper quan trọng trước khi đăng ký transformer;
- denylist package của agent/công cụ;
- giữ đường thực thi transform nhẹ và ít phụ thuộc;
- dùng ThreadLocal hoặc guard chống reentrancy khi phù hợp;
- không thực hiện network I/O hoặc khởi tạo nặng trong callback nếu có thể tránh.

Quá trình nạp class là môi trường đồng thời và có thể reentrant. Transformer phải được thiết kế như hạ tầng runtime, không như một request handler thông thường.
