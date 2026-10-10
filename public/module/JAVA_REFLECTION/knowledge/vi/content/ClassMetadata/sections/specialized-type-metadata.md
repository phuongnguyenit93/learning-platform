Không phải mọi `Class<?>` đều có cùng một tập thông tin có ý nghĩa. Sau khi xác định **loại** của kiểu, Reflection thường cung cấp API chuyên biệt cho loại đó.

Với mảng, `Class` cho biết kiểu phần tử trực tiếp:

~~~java
Class<?> arrayType = String[][].class;

System.out.println(arrayType.isArray());
System.out.println(arrayType.getComponentType());
System.out.println(arrayType.getComponentType().getComponentType());
~~~

`getComponentType()` trả `null` nếu `Class<?>` hiện tại không biểu diễn mảng. Với mảng nhiều chiều, mỗi lần gọi bóc ra một chiều vì kiểu phần tử trực tiếp của `String[][]` là `String[]`.

Với enum, `getEnumConstants()` trả các hằng enum theo thứ tự khai báo:

~~~java
enum PaymentStatus { CREATED, PAID, FAILED }

PaymentStatus[] values = PaymentStatus.class.getEnumConstants();
~~~

Nếu kiểu không phải enum, `getEnumConstants()` trả `null`.

Record có siêu dữ liệu riêng vì **record component** là một khái niệm của ngôn ngữ, không đơn giản đồng nghĩa với field hoặc method:

~~~java
record PaymentRequest(String orderId, long amount) {}

for (RecordComponent component : PaymentRequest.class.getRecordComponents()) {
    System.out.println(component.getName());
    System.out.println(component.getType());
    System.out.println(component.getAccessor());
}
~~~

`getRecordComponents()` trả các component theo thứ tự trong record header và trả `null` nếu kiểu không phải record. `RecordComponent` còn cung cấp kiểu generic và siêu dữ liệu annotation, nên serializer/framework có thể làm việc theo **hợp đồng của record** thay vì suy đoán record chỉ từ private field hoặc accessor method.

Sealed class/interface cũng để lại cấu trúc có thể kiểm tra:

~~~java
sealed interface Payment permits CardPayment, BankTransfer {}
final class CardPayment implements Payment {}
final class BankTransfer implements Payment {}

Class<?> paymentType = Payment.class;

if (paymentType.isSealed()) {
    for (Class<?> permitted : paymentType.getPermittedSubclasses()) {
        System.out.println(permitted.getName());
    }
}
~~~

`getPermittedSubclasses()` cho biết các kiểu con trực tiếp được phép khi kiểu là sealed và trả `null` nếu kiểu không sealed. Reflection chỉ **quan sát hợp đồng đã được khai báo**; cách thiết kế hệ phân cấp sealed thuộc phần type/OOP.

~~~text
Class<?> chung
    ↓ hỏi loại kiểu
    ├─ mảng   → kiểu phần tử
    ├─ enum   → các hằng enum
    ├─ record → các record component
    └─ sealed → các kiểu con trực tiếp được phép
~~~
