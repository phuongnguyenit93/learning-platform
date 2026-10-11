# Path, Files và mô hình hệ thống tệp hiện đại

Sau `java.io.File`, Java hiện đại thường làm việc với hệ thống tệp qua hai vai trò tách biệt: `Path` biểu diễn **đường dẫn**, còn `Files` thực hiện **thao tác I/O và truy vấn siêu dữ liệu (metadata)** trên đường dẫn đó. Cách tách này giúp ta trả lời hai câu hỏi độc lập: tài nguyên nằm ở đâu, và ta muốn làm gì với tài nguyên ấy?

Trong các ví dụ của chương này, ta dùng một thư mục tạm và một tệp UTF-8:

~~~java
Path tempDir = Files.createTempDirectory("io-demo-");
Path note = tempDir.resolve("note.txt");
String text = "Xin chào Java I/O";
~~~
