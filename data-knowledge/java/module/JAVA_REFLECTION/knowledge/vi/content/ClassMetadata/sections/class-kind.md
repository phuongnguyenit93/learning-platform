Một `Class<?>` có thể đại diện nhiều loại kiểu khác nhau. Trước khi áp dụng quy tắc, framework thường phải phân loại nó.

~~~java
Class<?> type = PaymentService.class;

boolean interfaceType = type.isInterface();
boolean enumType = type.isEnum();
boolean recordType = type.isRecord();
boolean annotationType = type.isAnnotation();
boolean arrayType = type.isArray();
boolean primitiveType = type.isPrimitive();
boolean syntheticType = type.isSynthetic();
~~~

Ví dụ:

~~~java
record PaymentRequest(String orderId, long amount) {}
enum PaymentStatus { CREATED, PAID }

System.out.println(PaymentProcessor.class.isInterface()); // true
System.out.println(PaymentRequest.class.isRecord());      // true
System.out.println(PaymentStatus.class.isEnum());         // true
System.out.println(String[].class.isArray());              // true
System.out.println(long.class.isPrimitive());              // true
~~~

Các câu hỏi này quan trọng vì mỗi loại có quy tắc khác nhau. Serializer có thể xử lý record qua record component. Cơ chế proxy có thể yêu cầu interface. Factory tạo đối tượng không thể đối xử abstract class như class cụ thể. Mảng không có khai báo mã nguồn kiểu class thông thường nhưng vẫn có đối tượng `Class`.

Một vài nhóm còn có thể chồng lên nhau. Annotation type về mặt hệ kiểu JVM/Java cũng là một dạng interface, nên mã nên hỏi đúng đặc tính mình cần thay vì giả định các `isXxx()` tạo ra những nhóm loại trừ nhau hoàn toàn.

`isSynthetic()` cho biết khai báo do trình biên dịch tạo và đánh dấu synthetic. Reflection có thể nhìn thấy nhiều phần tử sinh tự động không xuất hiện rõ trong mã nguồn; vì vậy công cụ thường cần quyết định có giữ hay lọc chúng.

Ngoài việc hỏi “đây là loại gì?”, framework còn thường phải kiểm tra **quan hệ kiểu lúc chạy** trước khi ép kiểu hoặc đăng ký phần triển khai. `Class` cung cấp các API an toàn kiểu hơn việc tự ép kiểu mù:

~~~java
Class<?> discovered = PaymentService.class;
Object service = new PaymentService("stripe");

System.out.println(discovered.isInstance(service));
// true — tương tự một instanceof động

System.out.println(
        PaymentProcessor.class.isAssignableFrom(discovered)
);
// true — một PaymentService có thể được gán vào biến PaymentProcessor

PaymentService typed = PaymentService.class.cast(service);

Class<? extends PaymentProcessor> processorType =
        discovered.asSubclass(PaymentProcessor.class);
~~~

Chiều của `isAssignableFrom(...)` rất dễ viết ngược. Hãy đọc `A.isAssignableFrom(B)` là: **một giá trị của B có thể gán cho biến kiểu A hay không?** `cast(...)` thực hiện ép kiểu có kiểm tra lúc chạy; `asSubclass(...)` làm điều tương tự ở mức đối tượng `Class` và ném `ClassCastException` nếu kiểu được phát hiện không phải kiểu con (subtype) phù hợp.
