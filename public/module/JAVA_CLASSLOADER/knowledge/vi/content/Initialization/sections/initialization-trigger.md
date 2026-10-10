Khởi tạo là lúc JVM thực thi logic khởi tạo `static` của class hoặc interface theo các quy tắc của Java.

Những thao tác sử dụng chủ động quan trọng gồm:

- tạo instance của một class bằng `new`;
- gọi một `static` method được khai báo bởi class hoặc interface đó;
- đọc hoặc ghi một `static` field được khai báo bởi class hoặc interface đó khi field không phải hằng số lúc biên dịch;
- một số thao tác reflection/runtime yêu cầu khởi tạo;
- class khởi động của ứng dụng được JVM khởi tạo trước khi gọi `main`.

Khi một **class** được khởi tạo, superclass của nó được khởi tạo trước và JVM cũng xử lý các superinterface cần thiết theo quy tắc về default method; điều này không có nghĩa mọi interface trong toàn bộ graph đều bị khởi tạo. Khi chính một **interface** được khởi tạo, các superinterface của nó cũng không tự động bị khởi tạo chỉ vì quan hệ kế thừa.

Ví dụ:

```java
final class PaymentPlugin {
    static {
        System.out.println("PaymentPlugin initialized");
    }

    static void register() {
        System.out.println("registered");
    }
}

public class Demo {
    public static void main(String[] args) {
        PaymentPlugin.register();
    }
}
```

Kết quả:

```text
PaymentPlugin initialized
registered
```

JVM phải initialize `PaymentPlugin` trước khi thực thi `register()`.

Điểm quan trọng là **nạp class không tự động đồng nghĩa với khởi tạo**. Đây là ranh giới cần thiết cho framework, reflection và việc tìm plugin vì ta có thể muốn quan sát một kiểu mà chưa muốn chạy tác dụng phụ `static` của nó.
