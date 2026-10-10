ASM là thư viện bytecode mức thấp, phổ biến để đọc/ghi class file qua API dạng visitor/tree. Trong Instrumentation, ASM phù hợp khi:

- cần kiểm soát chính xác method/instruction;
- phép biến đổi nhỏ nhưng nhạy về hiệu năng;
- đội ngũ đã có chuyên môn bytecode/JVM;
- cần tránh mức trừu tượng tạo cơ chế phụ trợ ngoài ý muốn.

Mô hình tư duy:

~~~text
classfileBuffer
→ ClassReader
→ biến đổi bằng visitor/tree
→ ClassWriter
→ byte[]
~~~

Đổi lại, lập trình viên phải chịu nhiều trách nhiệm hơn:

- chọn API/class-file version đúng;
- xử lý frame/max stack đúng;
- giữ luồng điều khiển hợp lệ;
- không làm mất attribute quan trọng;
- kiểm thử trên đầu ra của nhiều JDK/compiler.

Module này chỉ cần học ASM đủ để hiểu vai trò triển khai; API chi tiết của toàn thư viện không phải nội dung chính.
