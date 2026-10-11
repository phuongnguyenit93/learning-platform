Locale không chỉ ảnh hưởng cách **viết** ngày. Một số quy ước lịch dành cho con người cũng có thể khác giữa các Locale, đặc biệt là khái niệm **tuần**.

Ví dụ hai câu hỏi tưởng đơn giản:

```text
Một tuần bắt đầu vào thứ mấy?
Tuần đầu tiên của năm phải có tối thiểu bao nhiêu ngày?
```

không có một câu trả lời duy nhất cho mọi văn hóa/quy ước vùng.

Java biểu diễn các quy ước này bằng `WeekFields`:

```java
WeekFields weekFields = WeekFields.of(locale);

DayOfWeek firstDay = weekFields.getFirstDayOfWeek();
int minimalDays = weekFields.getMinimalDaysInFirstWeek();
```

Các thành phần chính:

```text
ngày đầu tuần
→ ngày được xem là bắt đầu tuần

số ngày tối thiểu trong tuần đầu tiên
→ số ngày tối thiểu để một tuần được tính là tuần đầu của năm

trường dữ liệu dựa trên tuần
→ weekOfMonth / weekOfYear / weekOfWeekBasedYear...
```

Vai trò của `WeekFields` là cung cấp **quy ước lịch phụ thuộc Locale** cho các trường hợp trình bày/lịch.

Nhưng phải giữ ranh giới quan trọng:

```text
quy ước lịch phụ thuộc Locale
≠ quy tắc nghiệp vụ
```

Nếu nghiệp vụ nói “tuần kế toán luôn bắt đầu thứ Hai”, hãy biểu diễn quy tắc đó tường minh bằng `WeekFields.of(DayOfWeek.MONDAY, ...)` hoặc một chính sách riêng. Không để Locale của người dùng vô tình đổi logic nghiệp vụ.
