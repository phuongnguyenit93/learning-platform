Method được chọn bằng tên và kiểu tham số:

~~~java
Method pay = PaymentService.class.getMethod(
        "pay",
        PaymentRequest.class
);

Method internalStatus = PaymentService.class.getDeclaredMethod(
        "internalStatus"
);
~~~

`getMethod(...)` tìm public method trên bề mặt public và có thể thấy method được kế thừa. `getDeclaredMethod(...)` tìm method được khai báo trực tiếp trên class hiện tại với mọi mức truy cập, nhưng không tự tìm method được kế thừa.

Ví dụ:

~~~java
class BaseService {
    public String serviceId() {
        return "base";
    }
}

class PaymentService extends BaseService {
    private String internalStatus() {
        return "ok";
    }
}
~~~

~~~text
PaymentService.class.getMethod("serviceId")
→ tìm thấy public method được kế thừa

PaymentService.class.getDeclaredMethod("serviceId")
→ NoSuchMethodException

PaymentService.class.getDeclaredMethod("internalStatus")
→ tìm thấy đối tượng mô tả method private
~~~

Với overload, kiểu tham số là phần bắt buộc để chọn đúng method:

~~~java
class PaymentFormatter {
    String format(long amount) { return Long.toString(amount); }
    String format(String amount) { return amount; }
}

Method a = PaymentFormatter.class.getDeclaredMethod("format", long.class);
Method b = PaymentFormatter.class.getDeclaredMethod("format", String.class);
~~~

`int.class` và `Integer.class` là hai đối tượng `Class` khác nhau. Vì vậy:

~~~java
PaymentFormatter.class.getDeclaredMethod("format", Long.class);
// NoSuchMethodException nếu không có overload nhận Long
~~~

Việc khám phá yêu cầu **kiểu tham số đã khai báo phải chính xác**, không thực hiện cơ chế chọn overload kiểu trình biên dịch cho đóng hộp (boxing), mở rộng primitive (widening) hay “method gần giống nhất”.

Khi cần liệt kê:

~~~java
Method[] declared = PaymentService.class.getDeclaredMethods();
Method[] publicMethods = PaymentService.class.getMethods();
~~~

Đừng phụ thuộc vào thứ tự mảng. Trình biên dịch còn có thể tạo synthetic/bridge method, đặc biệt quanh generics và override. `isSynthetic()` và `isBridge()` giúp framework nhận diện chúng khi chính sách cần lọc.

Public instance method từ superinterface có thể xuất hiện qua `getMethod()`/`getMethods()`, nhưng `static` method của interface **không được kế thừa** bởi class triển khai hoặc subinterface. Muốn lấy một static interface method bằng Reflection, hãy tra cứu trên chính interface khai báo nó.
