Native interoperability khiến triển khai trở thành một phần của tính đúng đắn.

Ứng dụng cần quản lý:

- native artifact theo OS/architecture;
- dependency native đi kèm;
- search/load path;
- symbol/version compatibility;
- JDK/runtime option như --enable-preview và native access khi dùng FFM Java 21.

Khả năng chạy đa nền tảng không còn chỉ là “JAR chạy ở đâu cũng được”. Java layer có thể portable nhưng native binary thường phải được build riêng cho từng target.

Ràng buộc phiên bản cũng cần tách rõ: version của JDK, version JNI/FFM API, version native header và version binary library. Ma trận kiểm thử nên phản ánh các tổ hợp thực sự được hỗ trợ thay vì chỉ chạy trên máy developer.
