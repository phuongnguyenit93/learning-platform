Khi lifecycle resource kéo dài hơn ownership/intention của hệ thống và không còn được quản lý đúng.

Ví dụ:

- request tạo pool nhưng quên shutdown;
- Thread infinite loop không cancellation path;
- scheduler được đăng ký lặp ngoài ý muốn;
- worker ThreadLocal giữ stale context;
- queue backlog tăng vô hạn.
