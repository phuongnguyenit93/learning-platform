Một dịch vụ có thể nhận `Clock` qua hàm tạo:

```java
final class TokenService {
    private final Clock clock;

    TokenService(Clock clock) {
        this.clock = clock;
    }

    boolean isExpired(Instant expiresAt) {
        return !clock.instant().isBefore(expiresAt);
    }
}
```

Môi trường thực tế:

```java
TokenService service = new TokenService(Clock.systemUTC());
```

Kiểm thử:

```java
Clock fixed = Clock.fixed(
        Instant.parse("2026-09-27T10:00:00Z"),
        ZoneOffset.UTC
);

TokenService service = new TokenService(fixed);
```

### Chọn nơi truyền Clock vào

Không nhất thiết mọi phương thức đều phải nhận tham số `Clock`. Thường ứng dụng truyền một `Clock` vào tại ranh giới dịch vụ/thành phần rồi dùng lại bên trong. Mục tiêu là **không để logic nghiệp vụ tự truy cập nguồn thời gian toàn cục một cách không kiểm soát**.

### Clock không thay thế bộ lập lịch

`Clock` trả lời “thời gian hiện tại là gì theo nguồn này?”. Nó không tự chạy tác vụ, không lập lịch tác vụ và không đảm bảo thời điểm đánh thức. Lập lịch là trách nhiệm khác.

Sau khi hiểu cách kiểm soát “thời điểm hiện tại”, chương cuối nhìn lại API cũ, rủi ro của múi giờ mặc định và cách chọn thông tin cần lưu trữ. Phần khoảng trống/chồng lặp DST đã được xử lý ở chương phép toán và quy tắc múi giờ ngay trước đó.
