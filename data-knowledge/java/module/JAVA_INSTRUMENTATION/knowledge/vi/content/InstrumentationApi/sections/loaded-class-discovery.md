Instrumentation có hai API khám phá runtime dễ nhầm:

- getAllLoadedClasses(): tất cả class hiện đã được JVM nạp;
- getInitiatedClasses(loader): các class mà loader đó đã khởi tạo liên kết hoặc có thể tìm theo tên theo ngữ nghĩa API.

getAllLoadedClasses() bao gồm cả hidden class/interface và array class. Ngược lại, getInitiatedClasses(loader) không thể trả hidden class/interface (hoặc array có phần tử là hidden class) vì chúng không thể được tìm theo tên bằng ClassLoader::loadClass/Class::forName.

Agent nạp động thường dùng getAllLoadedClasses() để tìm class mục tiêu đã được nạp:

~~~java
if (!inst.isRetransformClassesSupported()) {
    return;
}

for (Class<?> type : inst.getAllLoadedClasses()) {
    if (type.getName().equals("com.example.OrderService")
            && inst.isModifiableClass(type)) {
        inst.retransformClasses(type);
    }
}
~~~

Không nên quét rồi retransform mọi class. Việc chọn mục tiêu cần lọc theo package/class/loader/module để tránh:

- instrument chính agent/helper của mình;
- sửa class JDK không mong muốn;
- kích hoạt vòng phụ thuộc;
- tăng chi phí lúc khởi động và khi chạy.

Các API khám phá cho phép agent nhìn danh sách class runtime, nhưng không thay thế mô hình tư duy về ClassLoader.
