Trước khi học sâu, người học nên có các mô hình tư duy sau:

- **JVM / bytecode:** class file là đầu vào để JVM verify, link và thực thi.
- **ClassLoader:** identity của class gắn với binary name + defining loader; transformer nhận ngữ cảnh loader.
- **JPMS cơ bản:** readability, exports và opens để hiểu redefineModule.
- **Concurrency cơ bản:** quá trình nạp class có thể xảy ra trên nhiều thread; transformer phải an toàn trước race/reentrancy.

Module này sở hữu Java Agent, Instrumentation, ClassFileTransformer, redefine/retransform và ranh giới vận hành trực tiếp của agent.

Các phần được handoff:

~~~text
định dạng class file / phần thực thi nội bộ của JVM
→ JVM

ủy quyền nạp class / identity chuyên sâu
→ Java Core ClassLoader

ngữ nghĩa JPMS chuyên sâu
→ Java 9 Module System

diễn giải bằng chứng / xử lý sự cố
→ Runtime Diagnostics

phần nội bộ JVMTI / native agent
→ ranh giới công cụ native/JVM
~~~

Giữ ranh giới này giúp ta học đủ để viết và đánh giá agent mà không biến module thành một khóa JVM, ClassLoader, JPMS hay ASM thứ hai.
