Chuỗi biến đổi có thể được kích hoạt bởi ba loại thao tác:

~~~text
định nghĩa class mới
→ ClassLoader.defineClass hoặc cơ chế native tương đương

redefine class
→ Instrumentation.redefineClasses

retransform class
→ Instrumentation.retransformClasses
~~~

Trong cả ba trường hợp, transformer chạy trước khi JVM áp dụng định nghĩa kết quả. Nhưng **bytes đầu vào và transformer nào được gọi** không giống nhau.

Với lần nạp đầu, đầu vào bắt nguồn từ bytes được đưa vào defineClass. Với redefine, đầu vào bắt nguồn từ ClassDefinition do bên gọi cung cấp. Với retransform, JVM quay về bytes ban đầu/lần redefine gần nhất phù hợp rồi tự tái áp dụng kết quả của các transformer không hỗ trợ retransformation trước khi gọi nhóm transformer hỗ trợ retransformation.

Vì vậy khi gỡ lỗi chuỗi biến đổi, câu hỏi đầu tiên luôn là: **thao tác hiện tại là nạp lần đầu, redefine hay retransform?**
