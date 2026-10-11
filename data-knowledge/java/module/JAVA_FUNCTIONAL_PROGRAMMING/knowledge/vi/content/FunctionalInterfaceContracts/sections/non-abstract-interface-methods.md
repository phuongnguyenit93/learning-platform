Các phương thức `default`, `static` và `private` đã có phần cài đặt nên không làm tăng số hành vi trừu tượng mà lambda phải cung cấp.

Phương thức `default` và `static` trong giao diện có từ Java 8. Phương thức `private` trong giao diện được bổ sung từ Java 9, vì vậy hàm hỗ trợ `private static` ở ví dụ bên dưới không hợp lệ nếu biên dịch với mức tương thích nguồn Java 8.

```java
@FunctionalInterface
interface TextFormatter {
    String format(String value);

    default String formatTrimmed(String value) {
        return format(value.trim());
    }

    static TextFormatter identity() {
        return value -> value;
    }

    private static boolean missing(String value) {
        return value == null;
    }
}
```

Ở đây chỉ `format` là hợp đồng hàm. Những phương thức còn lại có thể cung cấp tiện ích, cơ chế tạo hoặc logic nội bộ mà không phá SAM.

Dù vậy, không nên biến giao diện hàm thành nơi gom hàng loạt hàm hỗ trợ không liên quan. Giao diện vẫn cần truyền đạt một hành vi trung tâm rõ ràng cho bên gọi.
