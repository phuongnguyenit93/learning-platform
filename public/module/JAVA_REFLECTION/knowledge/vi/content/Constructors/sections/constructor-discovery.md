Constructor không được kế thừa, nên việc khám phá đơn giản hơn hệ phân cấp method nhưng vẫn có hai góc nhìn public/declared:

~~~java
Constructor<PaymentService> publicCtor =
        PaymentService.class.getConstructor(String.class);

Constructor<PaymentService> declaredCtor =
        PaymentService.class.getDeclaredConstructor(
                String.class,
                int.class
        );
~~~

`getConstructor(...)` chỉ tìm public constructor của chính class. `getDeclaredConstructor(...)` tìm constructor được khai báo trực tiếp với mọi mức truy cập.

Kiểu tham số phải khớp khai báo chính xác:

~~~java
PaymentService.class.getDeclaredConstructor(
        String.class,
        Integer.class
);
// NoSuchMethodException nếu constructor thực tế nhận int
~~~

Giống việc khám phá Method, tra cứu không chạy cơ chế chọn overload kiểu trình biên dịch và không coi `Integer.class` tương đương `int.class`.

Khi liệt kê:

~~~java
Constructor<?>[] publicCtors =
        PaymentService.class.getConstructors();

Constructor<?>[] allDeclaredCtors =
        PaymentService.class.getDeclaredConstructors();
~~~

Không nên chọn phần tử đầu tiên làm constructor mặc định của framework. Thứ tự Reflection không phải hợp đồng của mã nguồn. Dependency injection container nên có quy tắc rõ ràng, ví dụ annotation đánh dấu constructor, một constructor duy nhất, hoặc một chính sách được mô tả rõ.

Một lỗi rất thường gặp là giả định mọi class có no-arg constructor:

~~~java
PaymentService.class.getDeclaredConstructor();
// NoSuchMethodException với mẫu PaymentService hiện tại
~~~

Java chỉ sinh constructor mặc định không tham số khi mã nguồn không khai báo constructor nào. Chỉ cần class khai báo `PaymentService(String provider)`, trình biên dịch không tự thêm `PaymentService()`.

Inner class không static còn có một ranh giới khác: constructor lúc chạy thường có thêm tham số cho instance bao ngoài. Vì vậy chữ ký Reflection có thể chứa tham số mà lời gọi trong mã nguồn trông không giống hệt.
