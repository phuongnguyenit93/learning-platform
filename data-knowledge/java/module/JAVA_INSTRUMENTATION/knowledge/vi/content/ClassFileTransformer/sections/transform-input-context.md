Callback transform cung cấp đủ ngữ cảnh để agent quyết định có nên xử lý class hay không:

- module: module chứa class;
- loader: defining loader, có thể null cho bootstrap loader;
- className: binary name ở dạng nội bộ, ví dụ java/util/List;
- classBeingRedefined: null ở lần nạp đầu, khác null khi redefine/retransform;
- protectionDomain: ngữ cảnh bảo vệ của class;
- classfileBuffer: bytes đầu vào theo định dạng class file.

className dùng dấu slash thay vì dấu chấm:

~~~java
if (className != null
        && className.startsWith("com/example/")) {
    // candidate
}
~~~

Không nên chọn mục tiêu chỉ theo className nếu ứng dụng có nhiều ClassLoader. Cùng một binary name do hai loader khác nhau định nghĩa là hai Class khác nhau. Với agent/framework phức tạp, module + loader + className thường là bộ lọc an toàn hơn.
