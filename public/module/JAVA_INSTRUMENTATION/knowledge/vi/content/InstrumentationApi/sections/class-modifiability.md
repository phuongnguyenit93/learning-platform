JVM hỗ trợ retransform/redefine **không có nghĩa mọi Class đều có thể sửa đổi**. isModifiableClass(type) trả lời câu hỏi theo từng class.

Ví dụ:

~~~java
if (!inst.isRetransformClassesSupported()) {
    return;
}
if (!inst.isModifiableClass(OrderService.class)) {
    return;
}
inst.retransformClasses(OrderService.class);
~~~

Primitive class và array class không thể sửa đổi. Một hiện thực JVM cũng có thể có thêm class không thể sửa đổi.

Do đó cần tách hai tầng:

~~~text
khả năng ở cấp JVM
→ "runtime này hỗ trợ retransform/redefine không?"

khả năng sửa đổi ở cấp class
→ "class cụ thể này có được phép thay đổi không?"
~~~

Bỏ qua tầng thứ hai thường dẫn tới UnmodifiableClassException khi chạy.
