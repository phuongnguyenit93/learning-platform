Khi class hoặc interface có logic khởi tạo `static` cần thực thi, mô hình class-file/JVM dùng một method khởi tạo đặc biệt tên `<clinit>`.

Ví dụ mã nguồn:

```java
final class PaymentPlugin {
    static int retryCount = loadRetryCount();

    static {
        System.out.println("register metrics");
    }

    private static int loadRetryCount() {
        return 3;
    }
}
```

Mô hình tư duy:

```text
static field initializer cần chạy
        +
static initializer block
        ↓
class initialization logic
        ↓
<clinit> ở bytecode model khi cần
```

Các static field initializer và static block có hiệu lực theo thứ tự xuất hiện của declaration trong class, sau khi JVM đã thực hiện các quy tắc initialization tiên quyết như initialize superclass thích hợp.

`<clinit>` không phải method để ứng dụng gọi:

```java
// Không có API source-level kiểu này:
// PaymentPlugin.<clinit>();
```

JVM tự quyết định khi nào initialize theo JLS/JVM rules.

### Class và interface có quy tắc khác nhau

Quy tắc thứ tự đã nêu ở phần kích hoạt vẫn áp dụng: khi khởi tạo một class, JVM khởi tạo superclass trước và xử lý các superinterface cần thiết theo quy tắc về default method; không phải toàn bộ cây interface đều bị khởi tạo. Việc khởi tạo chính một interface cũng không đồng nghĩa mọi superinterface của nó bị khởi tạo theo.

Điểm người học cần giữ ở đây: khởi tạo là **một quy trình của JVM**, không phải “JVM chạy tất cả khối `static` của mọi kiểu có liên quan”.
