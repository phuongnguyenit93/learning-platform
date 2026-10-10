`Class` cung cấp nhiều API lấy tên vì “tên của một kiểu” có nhiều mục đích khác nhau.

~~~java
Class<?> type = PaymentService.class;

System.out.println(type.getName());
System.out.println(type.getSimpleName());
System.out.println(type.getCanonicalName());
System.out.println(type.getTypeName());
~~~

Với một top-level class bình thường, kết quả thường dễ đoán:

~~~text
getName()          → com.example.PaymentService
getSimpleName()    → PaymentService
getCanonicalName() → com.example.PaymentService
getTypeName()      → com.example.PaymentService
~~~

Nhưng các API này không đồng nghĩa.

`getName()` trả **tên nhị phân (binary name)** đối với class/interface thông thường. Class lồng nhau vì vậy có thể chứa ký tự `$`:

~~~java
class PaymentModule {
    static class Config {}
}

System.out.println(PaymentModule.Config.class.getName());
// com.example.PaymentModule$Config
~~~

`getSimpleName()` trả phần tên ngắn, phù hợp cho log/giao diện hơn, nhưng class ẩn danh (anonymous class) có thể trả chuỗi rỗng. Vì vậy không nên dùng tên đơn giản làm định danh duy nhất cho tuần tự hóa, registry hay lưu trữ lâu dài.

`getCanonicalName()` trả tên chính tắc (canonical name) nếu kiểu có tên chính tắc. Class cục bộ và class ẩn danh có thể trả `null`. Đây là một dấu hiệu quan trọng: mã framework phải chấp nhận rằng không phải mọi `Class` đều ánh xạ sạch sang một tên ở cấp mã nguồn.

`getTypeName()` được thiết kế để biểu diễn kiểu dễ đọc hơn trong ngữ cảnh `Type`. Với mảng nó hữu ích hơn tên nhị phân:

~~~java
System.out.println(String[].class.getName());      // [Ljava.lang.String;
System.out.println(String[].class.getTypeName());  // java.lang.String[]
~~~

Primitive cũng có Class:

~~~java
System.out.println(int.class.getName());      // int
System.out.println(int.class.getTypeName());  // int
~~~

Khi thiết kế framework, hãy chọn loại tên theo hợp đồng: tên nhị phân cho tra cứu như `Class.forName(...)`, tên đơn giản cho hiển thị, tên chính tắc/tên kiểu cho mô tả dễ đọc khi phù hợp. Đừng giả định một API tên có thể dùng an toàn cho mọi mục đích.
