Redefine/retransform thay **định nghĩa code**, không tạo lại object đang tồn tại.

Java API nêu rõ:

- các instance của class không bị thay thế;
- biến static giữ giá trị hiện tại;
- class initializer không tự chạy lại chỉ vì redefine/retransform.

Ví dụ OrderService có:

~~~java
static int requestCount = 42;
private final String region = "ap-southeast";
~~~

Sau khi retransform thân method, requestCount không tự về 0 và constructor không chạy lại cho các instance OrderService hiện có.

Đây là lý do các thay đổi cấu trúc bị giới hạn mạnh: JVM phải giữ identity/trạng thái của class và object hiện có trong khi phần hiện thực method có thể đổi.

Nếu công cụ cần “di chuyển schema/trạng thái object”, Java Instrumentation redefine/retransform không phải cơ chế phù hợp.
