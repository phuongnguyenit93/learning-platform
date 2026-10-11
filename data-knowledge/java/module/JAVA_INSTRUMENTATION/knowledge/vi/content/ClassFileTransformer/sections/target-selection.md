Transformer tốt nên **lọc sớm**. Nếu mọi class đều đi qua bộ phân tích bytecode trước khi biết có phải mục tiêu hay không, overhead lúc khởi động và rủi ro sẽ tăng mạnh.

Ví dụ:

~~~java
if (className == null) {
    return null;
}
if (!className.startsWith("com/example/order/")) {
    return null;
}
if (loader == null) {
    return null; // skip bootstrap classes for this agent
}
if (module != null && module.isNamed()
        && !"com.example.app".equals(module.getName())) {
    return null;
}
~~~

Các bộ lọc thực tế thường gồm:

- danh sách package/class được phép;
- danh sách loại trừ cho class của agent/helper/công cụ;
- identity/loại class loader;
- module name;
- annotation/interface đánh dấu nếu công cụ có metadata trước;
- trạng thái agent đang bật/tắt.

Việc chọn mục tiêu là một phần của tính đúng đắn, không chỉ là tối ưu hiệu năng.
