JDK biết cơ chế lịch nhưng không biết quy tắc nghiệp vụ của công ty bạn.

Ví dụ câu “hạn chót sau 3 ngày làm việc” cần trả lời:

```text
Thứ Bảy có tính không?
Chủ Nhật?
Ngày lễ quốc gia nào?
Ngày nghỉ riêng của công ty?
Mốc chốt 17:00 xử lý thế nào?
```

Không nên viết:

```java
deadline = start.plusDays(3);
```

rồi gọi đó là “3 ngày làm việc”. `plusDays(3)` chỉ biết ngày theo lịch.

Một thiết kế rõ ràng hơn:

```java
interface BusinessCalendar {
    LocalDate addBusinessDays(LocalDate start, int days);
    boolean isBusinessDay(LocalDate date);
}
```

Cách triển khai có thể sử dụng `LocalDate`, `DayOfWeek` và nguồn ngày nghỉ riêng.

Ranh giới này quan trọng vì API ngày-giờ của Java cung cấp **cơ chế**, còn lịch nghiệp vụ cung cấp **chính sách**.

Chương tiếp theo xử lý một phụ thuộc thường bị giấu trong mã: lời gọi “bây giờ là mấy giờ?” thông qua đồng hồ hệ thống.
