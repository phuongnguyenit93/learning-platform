Đối tượng Instrumentation là đại diện khả năng do JVM cung cấp. Agent không tự tạo bằng new hoặc tự hiện thực Instrumentation; Java API ghi rõ interface này không dành cho hiện thực bên ngoài module java.instrument.

Một mẫu tối thiểu:

~~~java
public final class TimingAgent {
    private static volatile Instrumentation instrumentation;

    public static void premain(String args, Instrumentation inst) {
        instrumentation = inst;
        inst.addTransformer(new TimingTransformer());
    }
}
~~~

Sau khi nhận đối tượng này, agent có thể giữ tham chiếu và dùng về sau để:

- thêm/gỡ transformer;
- xem các class đã được nạp;
- kiểm tra khả năng;
- yêu cầu retransform/redefine;
- thêm JAR vào đường tìm kiếm của bootstrap/system class loader;
- mở rộng quan hệ module qua redefineModule.

Đây là điểm nối giữa “agent được JVM khởi động” và “agent có quyền thao tác lên runtime”.
