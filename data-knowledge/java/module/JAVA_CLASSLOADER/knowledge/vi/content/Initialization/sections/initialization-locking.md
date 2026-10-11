Giả sử hai luồng cùng sử dụng chủ động một class chưa được khởi tạo:

```text
Luồng A ─┐
         ├→ PaymentPlugin chưa được khởi tạo
Luồng B ─┘
```

Quy trình khởi tạo của JVM dùng cơ chế đồng bộ riêng cho trạng thái khởi tạo của mỗi `Class`/interface. Một luồng thực hiện khởi tạo; luồng khác cần khởi tạo cùng kiểu sẽ chờ quy trình đó hoàn tất hoặc thất bại.

Ví dụ:

```java
final class SlowPlugin {
    static final Object CONFIG = loadConfig();

    private static Object loadConfig() {
        System.out.println(
                "init by " + Thread.currentThread().getName()
        );
        return new Object();
    }
}
```

Hai luồng đọc `SlowPlugin.CONFIG` cùng lúc không được phép làm bộ khởi tạo chạy hai lần cho cùng `SlowPlugin.class`.

### Mã khởi tạo vẫn có thể gây bế tắc (deadlock) ở cấp ứng dụng

JVM bảo đảm quy trình khởi tạo, nhưng mã khởi tạo `static` của ta vẫn có thể gọi mã khác, lấy khóa khác hoặc kích hoạt khởi tạo của kiểu khác.

```text
Thread A initializes A
→ cần B

Thread B initializes B
→ cần A
```

Nếu phụ thuộc/cơ chế khóa tạo thành vòng lặp xấu, ứng dụng có thể treo. Vì vậy bộ khởi tạo `static` nên ngắn, có tính xác định và tránh I/O, mạng hoặc đồ thị khóa phức tạp.
