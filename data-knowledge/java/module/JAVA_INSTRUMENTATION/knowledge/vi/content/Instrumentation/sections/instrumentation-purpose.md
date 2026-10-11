Java Instrumentation là cơ chế để một **Java agent** tham gia vào quá trình JVM định nghĩa hoặc thay đổi class. Điểm can thiệp chính là bytecode: agent có thể quan sát class đang được nạp và, khi cần, trả về một phiên bản bytecode khác trước khi JVM cài đặt định nghĩa đó.

Trong Java SE 21, package java.lang.instrument mô tả instrumentation như dịch vụ cho agent đang chạy trên JVM. Interface Instrumentation nhấn mạnh trường hợp phổ biến là **bổ sung bytecode để thu thập dữ liệu** cho profiler, agent giám sát, công cụ phân tích coverage hoặc bộ ghi sự kiện. Quy ước của package cũng cho phép agent biến đổi class khi nạp và, nếu JVM có khả năng tương ứng, xử lý lại class đã được nạp.

Mô hình tư duy nên giữ là:

~~~text
bytes của class ứng dụng
        ↓
JVM / nạp class
        ↓
ClassFileTransformer đã đăng ký
        ↓
bytes gốc hoặc bytes đã biến đổi
        ↓
JVM verify + link + cài định nghĩa class
~~~

Instrumentation tồn tại vì đôi khi logic cần áp dụng **xuyên suốt nhiều class mà không sửa mã nguồn của ứng dụng**. Đây là lý do nó thuộc Java Advanced: lập trình viên không chỉ gọi API ứng dụng nữa mà tham gia trực tiếp vào vòng đời của class trong JVM.
