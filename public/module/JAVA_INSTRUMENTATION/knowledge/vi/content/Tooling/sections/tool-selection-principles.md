Không có một công cụ bytecode “tốt nhất cho mọi agent”. Chọn công cụ theo câu hỏi:

~~~text
cần kiểm soát instruction/class-file ở mức thấp?
→ ưu tiên API mức thấp như ASM

cần mô tả phép biến đổi theo type/method matcher và advice?
→ mức trừu tượng cao như Byte Buddy thường dễ hơn

JDK mục tiêu đủ mới để dùng Class-File API chuẩn?
→ cân nhắc java.lang.classfile ở JDK phù hợp
~~~

Các tiêu chí quan trọng:

- phiên bản class file được hỗ trợ;
- khả năng giữ lại attributes;
- xử lý stack-map/frame;
- độ ổn định API;
- kích thước dependency;
- chiến lược helper/auxiliary class;
- tích hợp với redefine/retransform;
- mức độ dễ kiểm thử/gỡ lỗi.

Công cụ chỉ là lựa chọn triển khai. Vòng đời agent, việc chọn mục tiêu, các khả năng và giới hạn cấu trúc vẫn do Instrumentation/JVM quyết định.
