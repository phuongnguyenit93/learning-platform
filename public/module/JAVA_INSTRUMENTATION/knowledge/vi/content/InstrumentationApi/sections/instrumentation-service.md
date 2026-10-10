Instrumentation là lớp giao diện do JVM cung cấp cho agent để làm việc với các định nghĩa class. Thay vì agent gọi trực tiếp hook native/JVMTI, Java API gom các khả năng chính vào một đối tượng:

- đăng ký/gỡ ClassFileTransformer;
- xem class đã được nạp;
- kiểm tra class/module có thể sửa hay không;
- kiểm tra hỗ trợ redefine/retransform/native-prefix;
- yêu cầu retransform/redefine;
- mở rộng đường tìm kiếm của class loader;
- mở rộng quan hệ giữa các module;
- lấy ước lượng kích thước object.

Điểm quan trọng: Instrumentation không phải một “singleton tiện ích toàn cục”. Agent nhận đối tượng này từ premain/agentmain và nên coi nó là đại diện khả năng của JVM hiện tại.

Ví dụ:

~~~java
public static void premain(String args, Instrumentation inst) {
    System.out.println("Loaded classes: " + inst.getAllLoadedClasses().length);
}
~~~

API này là bề mặt điều khiển; kỹ nghệ bytecode vẫn nằm ở transformer và lớp công cụ.

Một API phụ dễ bị hiểu quá mức là getObjectSize(object): kết quả chỉ là **ước lượng phụ thuộc hiện thực** về bộ nhớ mà object tiêu thụ. Nó không phải kích thước sâu của toàn đồ thị đối tượng, không phù hợp để so sánh tuyệt đối giữa các hiện thực JVM và thậm chí ước lượng có thể thay đổi trong cùng một lần chạy JVM.
