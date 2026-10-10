Không phải mọi Class đều có thể sửa đổi.

Theo Instrumentation API:

- primitive class không thể sửa đổi;
- array class không thể sửa đổi;
- hiện thực JVM có thể có thêm class không thể sửa đổi.

Kiểm tra trước:

~~~java
if (!inst.isModifiableClass(target)) {
    // bỏ qua hoặc báo mục tiêu không được hỗ trợ
    return;
}
~~~

Hidden class/interface **không thể được sửa đổi bởi Java agent hoặc JVMTI agent**. getAllLoadedClasses() vẫn có thể trả về chúng, vì vậy “nhìn thấy Class object” không đồng nghĩa với khả năng redefine/retransform. isModifiableClass() phải phản ánh giới hạn này bằng false.

Một công cụ tốt nên báo rõ “class mục tiêu tồn tại nhưng không thể sửa đổi” thay vì để người dùng chỉ thấy UnmodifiableClassException mà không có ngữ cảnh.
