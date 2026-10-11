Định dạng class file tiến hóa theo JDK. Agent được build bằng một thư viện bytecode cũ có thể không hiểu phiên bản class file hoặc attribute mới của ứng dụng chạy trên JDK mới.

Các chiến lược:

- cố định phiên bản và chạy ma trận kiểm thử theo các JDK được hỗ trợ;
- cập nhật ASM/Byte Buddy khi cần hỗ trợ class file mới;
- tránh loại bỏ attribute mà công cụ không hiểu;
- bỏ qua an toàn bằng return null cho class/phiên bản chưa hỗ trợ nếu agent chỉ phục vụ observability;
- dừng sớm khi lỗi nếu instrumentation là yêu cầu bắt buộc về tính đúng đắn và phiên bản không được hỗ trợ là không thể chấp nhận.

Ví dụ:

~~~text
agent được biên dịch trên JDK 17
        ≠
không tự động an toàn cho mọi class file JDK 21/24
~~~

Tính tương thích gồm cả JVM API, phiên bản class file và công cụ bytecode — không chỉ mức source/target khi build agent JAR.
