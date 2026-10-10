Khi đã có `Field`, `get(...)` và `set(...)` thao tác trên một đối tượng cụ thể. Trước tiên hãy dùng một field `public` để quan sát cơ chế mà chưa vướng kiểm soát truy cập:

~~~java
class Counter {
    public int value = 1;
}

Counter counter = new Counter();
Field publicField = Counter.class.getField("value");

System.out.println(publicField.get(counter)); // 1
publicField.set(counter, 5);
System.out.println(counter.value);            // 5
~~~

Ở đây `publicField` là đối tượng mô tả cho `value`, còn `counter` là đối tượng nhận chứa trạng thái thực tế.

Với mô hình ví dụ xuyên suốt, `processedCount` là `private`, nên việc khám phá vẫn thành công nhưng thao tác giá trị còn phụ thuộc quyền truy cập:

~~~java
PaymentService service = new PaymentService("stripe");
Field field = PaymentService.class.getDeclaredField("processedCount");

// Hai dòng sau chỉ thành công nếu quyền truy cập phản chiếu được phép.
Object value = field.get(service);
field.set(service, 5);
~~~

Việc tách hai ví dụ này là có chủ ý: **`getDeclaredField()` tìm thấy thành phần không có nghĩa `get()/set()` được quyền dùng thành phần đó**. Chương **Quyền truy cập, đóng gói và giới hạn mô-đun** sẽ quay lại đúng ranh giới này với `canAccess(...)` và `trySetAccessible()`.

`Field.get(...)` trả `Object`. Với field primitive, giá trị được đóng hộp (boxing):

~~~java
int processedCount = (Integer) field.get(service);
~~~

`Field` có các API chuyên biệt như `getInt/setInt`, `getBoolean/setBoolean` để tránh ép kiểu ở bên gọi:

~~~java
int count = field.getInt(service);
field.setInt(service, 5);
~~~

Đối với static field, giá trị thuộc class thay vì một instance. Đối tượng nhận truyền vào `get/set` bị bỏ qua; quy ước dễ đọc nhất là truyền `null`:

~~~java
Field channel = PaymentService.class.getField("CHANNEL");
Object value = channel.get(null);
~~~

Với instance field, đối tượng nhận phải là instance tương thích với class khai báo field. Sai đối tượng nhận hoặc sai kiểu giá trị có thể dẫn tới `IllegalArgumentException`.

Reflection thực hiện một số chuyển đổi mở hộp (unboxing) và mở rộng primitive (widening) hợp lệ cho field primitive, nhưng không biến mọi giá trị thành kiểu đích. Ví dụ `setInt` chỉ phù hợp với field primitive có thể nhận `int` theo quy tắc của API; một `String` "5" không tự được chuyển thành số.

Mô hình cần ghi nhớ:

~~~text
Đối tượng mô tả Field
    +
đối tượng nhận (nếu là instance field)
    +
giá trị phù hợp (nếu set)
    ↓
truy cập lúc chạy
~~~

Nếu field private, việc đối tượng mô tả đã tồn tại không tự bỏ qua quy tắc truy cập. `IllegalAccessException` là lỗi bình thường khi bên gọi không có quyền truy cập phản chiếu. Chương **Quyền truy cập, đóng gói và giới hạn mô-đun** sẽ giải thích `canAccess(...)`, `trySetAccessible()` và JPMS.
