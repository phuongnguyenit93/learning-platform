# Nạp tài nguyên từ classpath

ClassLoader không chỉ liên quan tới bytecode trong tệp `.class`. Ứng dụng Java thường đóng gói thêm:

```text
config/default.yml
META-INF/services/...
templates/email.txt
plugin.properties
```

Những tệp này là **tài nguyên trên classpath**. Chúng có thể nằm trong thư mục, JAR, runtime image hoặc nguồn mà ClassLoader hiểu được.

Phần này dùng `URL`, `InputStream`, `Path` và try-with-resources để quan sát tài nguyên. Nếu các API I/O đó còn mới, chỉ cần giữ mô hình tư duy “tài nguyên có thể được tìm và đọc như một luồng dữ liệu”; chi tiết về luồng dữ liệu/tệp thuộc module `io` và không cần học lại ở đây.

Điểm dễ nhầm nhất là đường dẫn tài nguyên của `Class`, đường dẫn tài nguyên của `ClassLoader` và đường dẫn trên hệ thống tệp **không dùng cùng mô hình tư duy**.
