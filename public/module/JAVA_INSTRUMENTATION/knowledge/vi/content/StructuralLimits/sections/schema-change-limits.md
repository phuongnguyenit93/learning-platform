Các thay đổi cấu trúc lớn bị giới hạn, điển hình:

- thêm/xóa field;
- thêm/xóa method;
- đổi method signature;
- đổi modifiers của class, field hoặc method;
- đổi superclass hoặc các interface đã implement;
- đổi tên class.

Ví dụ muốn biến:

~~~java
class OrderService {
    void placeOrder() { ... }
}
~~~

thành:

~~~java
class OrderService extends NewBase {
    long agentState;              // field mới
    void placeOrder(String id) {} // signature mới
}
~~~

không phải loại thay đổi mà redefine/retransform nên kỳ vọng hỗ trợ.

Agent thường chèn logic vào **thân method hiện có** hoặc gọi helper bên ngoài để tránh thay đổi bố trí object.
