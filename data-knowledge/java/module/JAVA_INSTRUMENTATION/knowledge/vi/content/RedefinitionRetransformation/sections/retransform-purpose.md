Retransformation dùng khi muốn **chạy lại quá trình biến đổi trên class đã được nạp**.

~~~java
if (inst.isRetransformClassesSupported()
        && inst.isModifiableClass(OrderService.class)) {
    inst.retransformClasses(OrderService.class);
}
~~~

Agent không truyền bytes thay thế trực tiếp vào retransformClasses. JVM tự xây đầu vào chuỗi từ bytes ban đầu/lần redefine gần nhất, tái dùng đầu ra của các transformer không hỗ trợ retransformation rồi gọi lại các transformer có hỗ trợ retransformation.

“Bytes ban đầu” ở đây không phải cam kết byte-for-byte giống file .class ban đầu. API cho phép bố trí/thứ tự constant pool khác và một số attribute có thể khác hoặc không còn hiện diện, miễn các tham chiếu bytecode vẫn tương ứng về ngữ nghĩa. Transformer nên dựa trên mô hình/ngữ nghĩa class file thay vì bố trí byte thô chính xác của file gốc.

Điều này rất phù hợp cho cấu hình động:

~~~text
agent attach
→ đăng ký transformer hỗ trợ retransformation
→ tìm OrderService đã được nạp
→ retransform
→ timing probe xuất hiện
~~~

Sau đó nếu cấu hình đổi, agent có thể retransform lại và tạo bytes theo trạng thái mong muốn mới — miễn thiết kế phép biến đổi hỗ trợ điều đó.
