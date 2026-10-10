Java platform hiện có Class-File API chuẩn trong java.lang.classfile. Lịch sử:

~~~text
Java 22 → Preview
Java 23 → Second Preview
Java 24 → Standard API
~~~

API này cung cấp mô hình để phân tích, sinh và biến đổi class file. Nó có thể trở thành một lựa chọn công cụ quan trọng cho agent trên JDK phù hợp.

Nhưng module Instrumentation không sở hữu curriculum đầy đủ của java.lang.classfile. Lý do:

- Instrumentation là quy ước về agent runtime và vòng đời đã tồn tại từ lâu;
- Class-File API là API nền tảng riêng cho việc xử lý class file;
- người học dùng JDK 21 vẫn cần ASM/Byte Buddy hoặc công cụ tương thích khác;
- quá trình tiến hóa API theo phiên bản thuộc Java Version.

Ở đây chỉ cần hiểu điểm nối:

~~~text
ClassFileTransformer
→ cần byte[] mới
→ Class-File API / ASM / Byte Buddy có thể giúp tạo bytes
~~~
