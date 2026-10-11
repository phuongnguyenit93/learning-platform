Agent class không bắt buộc phải hiện thực một interface. JVM tìm các static method có signature do đặc tả quy định:

~~~java
public static void premain(String agentArgs, Instrumentation inst)

public static void agentmain(String agentArgs, Instrumentation inst)
~~~

Các overload chỉ nhận String cũng hợp lệ, nhưng nếu overload có Instrumentation tồn tại thì JVM ưu tiên nó. Điều này cho phép agent nhận đối tượng đại diện khả năng ngay lúc khởi động.

Các quy ước quan trọng:

- method phải là public static;
- tên method phụ thuộc đường khởi động;
- agent nên khởi tạo nhanh rồi trả quyền điều khiển;
- công việc chạy dài nên được quản lý rõ thay vì chặn premain/agentmain;
- cách xử lý exception khác nhau giữa agent khởi động cùng JVM và agent được nạp vào JVM đang chạy.

Không có một “vòng đời đối tượng Agent” do JVM quản lý như Spring bean. Vòng đời thực tế được quyết định bởi điểm vào static và trạng thái mà agent tự tạo.
