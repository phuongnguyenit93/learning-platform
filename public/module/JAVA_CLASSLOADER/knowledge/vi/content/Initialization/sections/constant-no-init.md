Một bẫy phổ biến:

Trước khi nói về constant, hãy nhớ thêm hai **non-trigger** quan trọng:

```java
Class<?> type = PaymentPlugin.class;
```

Lấy class literal `PaymentPlugin.class` tạo/lấy `Class<?>` nhưng **không tự nó initialize `PaymentPlugin`**.

Ngoài ra, nếu source viết `SubType.SOME_STATIC_FIELD` nhưng field đó thật sự được khai báo ở `SuperType`, thì với một static-field access **thực sự kích hoạt initialization** — ví dụ đọc một static field không phải compile-time constant — type được initialize là **class/interface khai báo field**, không phải cứ type nào xuất hiện bên trái dấu `.` trong source cũng bị initialize. Nếu field là compile-time constant thì exception ngay bên dưới vẫn áp dụng: việc đọc có thể không initialize cả `SuperType` lẫn `SubType`.

```java
final class PluginDefaults {
    static {
        System.out.println("PluginDefaults initialized");
    }

    static final int TIMEOUT_SECONDS = 30;
}

public class Demo {
    public static void main(String[] args) {
        System.out.println(PluginDefaults.TIMEOUT_SECONDS);
    }
}
```

`TIMEOUT_SECONDS` là constant variable với compile-time constant expression. Compiler có thể inline giá trị `30` vào mã gọi, nên việc đọc nó **không nhất thiết kích hoạt initialization của `PluginDefaults`**.

So sánh:

```java
final class PluginDefaults {
    static {
        System.out.println("initialized");
    }

    static final int A = 30;                    // compile-time constant
    static final Integer B = 30;                // không phải primitive/String constant variable
    static final String C = new String("prod"); // không phải constant expression
}
```

```text
đọc A
→ value có thể đã inline
→ không trigger initialization

đọc B hoặc C
→ getstatic của non-constant field
→ trigger initialization nếu class chưa initialized
```

Compile-time constant còn tạo ra một hệ quả khi triển khai: nếu thư viện đổi giá trị constant nhưng mã gọi cũ không được biên dịch lại, mã đó có thể tiếp tục dùng giá trị đã được inline trước đó.
