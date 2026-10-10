Vì `LocalDate` bất biến, phép toán luôn trả giá trị mới:

```java
LocalDate date = LocalDate.of(2026, 9, 27);

LocalDate tomorrow = date.plusDays(1);
LocalDate nextWeek = date.plusWeeks(1);
LocalDate nextMonth = date.plusMonths(1);
LocalDate lastYear = date.minusYears(1);
```

Ngoài các phương thức tiện ích như `plusDays`, Java còn có những API dùng chung cho lượng và đơn vị thời gian. Đoạn dưới chỉ là **giới thiệu trước**; `Period` sẽ được giải thích đầy đủ ở chương `Duration / Period`, còn `ChronoUnit` ở chương **Phép toán / So sánh**:

```java
LocalDate afterTenDays = date.plus(Period.ofDays(10));
long days = ChronoUnit.DAYS.between(date, afterTenDays);
```

Điểm cần hiểu là đây là **phép toán theo lịch**. `plusDays(1)` nghĩa là sang ngày lịch tiếp theo, không phải khẳng định “đã trôi qua đúng 24 giờ trên dòng thời gian”. Sự khác biệt này trở nên quan trọng khi ngày được kết hợp với múi giờ có DST.

### Điều chỉnh theo trường dữ liệu

```java
LocalDate date = LocalDate.of(2026, 9, 27);

LocalDate firstDay = date.withDayOfMonth(1);
LocalDate december = date.withMonth(12);
```

Với các quy tắc lịch phức tạp hơn, Java có `TemporalAdjusters`:

```java
LocalDate lastDayOfMonth = date.with(TemporalAdjusters.lastDayOfMonth());
LocalDate nextMonday = date.with(TemporalAdjusters.next(DayOfWeek.MONDAY));
```

Đừng biến `TemporalAdjusters` thành lịch nghiệp vụ. “Ngày làm việc tiếp theo” còn phụ thuộc cuối tuần, ngày lễ, quốc gia và chính sách công ty; đó là chính sách riêng của ứng dụng.
