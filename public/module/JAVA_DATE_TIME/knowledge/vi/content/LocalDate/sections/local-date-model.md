`LocalDate` phù hợp khi thông tin nghiệp vụ chỉ là một **ngày theo lịch**.

```java
LocalDate birthday = LocalDate.of(1993, 7, 20);
LocalDate invoiceDate = LocalDate.of(2026, 9, 27);
```

Hai giá trị trên chứa các trường năm, tháng và ngày trong tháng. Chúng không chứa giờ, phút, `ZoneId` hay `ZoneOffset`.

### Vì sao không dùng LocalDateTime cho mọi thứ?

Ta có thể giả tạo giờ `00:00`:

```java
LocalDateTime birthday = LocalDateTime.of(1993, 7, 20, 0, 0);
```

Nhưng lúc này mô hình đang nói thêm một điều mà nghiệp vụ không sở hữu: “sinh nhật xảy ra lúc nửa đêm”. Khi tuần tự hóa hoặc truy vấn cơ sở dữ liệu hoặc chuyển đổi múi giờ, thông tin giả đó có thể tạo ra lỗi và câu hỏi vô nghĩa.

Mô hình tốt hơn:

```text
Nghiệp vụ chỉ biết ngày
        ↓
LocalDate
        ↓
chỉ thêm giờ/múi giờ khi một trường hợp sử dụng thật sự cần
```

### Tạo LocalDate

Các cách phổ biến:

```java
LocalDate explicit = LocalDate.of(2026, 9, 27);
LocalDate parsed = LocalDate.parse("2026-09-27");
LocalDate today = LocalDate.now();
```

`LocalDate.now()` phụ thuộc đồng hồ/múi giờ của môi trường. Trong logic nghiệp vụ cần kiểm thử có kết quả xác định, chương `Clock` sẽ chỉ ra cách tránh gọi `now()` rải rác.

Đọc trường:

```java
int year = explicit.getYear();
Month month = explicit.getMonth();
int monthValue = explicit.getMonthValue();
int day = explicit.getDayOfMonth();
DayOfWeek dayOfWeek = explicit.getDayOfWeek();
```
