Phiên bản công cụ phải theo kịp phiên bản class file của ứng dụng mục tiêu.

Ma trận kiểm thử nên bao gồm:

~~~text
JDK dùng để build agent
× JDK runtime
× compiler của ứng dụng / phiên bản class file
× phiên bản công cụ bytecode
× các phiên bản framework quan trọng
~~~

Ví dụ một phiên bản ASM cũ có thể từ chối phiên bản class file mới; phiên bản Byte Buddy cũ có thể chưa hỗ trợ tính năng/attribute mới. Ngược lại, agent được build bằng API JDK 24 sẽ không chạy trên mốc cơ sở JDK 21 nếu dependency bytecode/API yêu cầu Java 24.

Thực hành tốt:

- công bố dải phiên bản JDK được hỗ trợ;
- CI chạy các ứng dụng đại diện trên từng dải;
- cố định phiên bản công cụ thay vì để thả nổi;
- nâng cấp công cụ cùng quá trình áp dụng JDK mới;
- có hành vi rõ với phiên bản class file chưa biết: bỏ qua hay báo lỗi.
