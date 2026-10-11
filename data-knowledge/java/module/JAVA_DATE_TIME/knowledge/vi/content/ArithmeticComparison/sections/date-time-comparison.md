Các kiểu thường có:

```java
a.isBefore(b);
a.isAfter(b);
a.compareTo(b);
a.equals(b);
```

Nhưng phải hỏi **đang so sánh cái gì**.

### So sánh LocalDate

```java
LocalDate a = LocalDate.of(2026, 9, 27);
LocalDate b = LocalDate.of(2026, 9, 28);

a.isBefore(b); // true
```

Đây là thứ tự trên ngày theo lịch.

### So sánh Instant

```java
instantA.isBefore(instantB);
```

Đây là thứ tự trên dòng thời gian toàn cục.

### Giá trị có múi giờ: cách biểu diễn cục bộ và vị trí trên dòng thời gian

Hai `ZonedDateTime` có thể có trường/múi giờ khác nhau nhưng cùng `Instant`. Khi nghiệp vụ hỏi “cùng sự kiện trên dòng thời gian không?”, cách rõ ràng là so `toInstant()` hoặc dùng API có ngữ nghĩa theo `Instant`.

```java
boolean sameMoment = a.toInstant().equals(b.toInstant());
boolean sameMomentDirectly = a.isEqual(b);
```

`isEqual(...)` trên các giá trị có múi giờ phù hợp trả lời câu hỏi bằng nhau trên dòng thời gian. Đừng dùng `equals()` như cách viết tắt cho mọi khái niệm “cùng thời điểm”; tính bằng nhau của đối tượng còn phụ thuộc trạng thái biểu diễn theo hợp đồng của từng kiểu.

Với `ZonedDateTime` và `OffsetDateTime`, có thể đọc các API theo hai nhóm:

```text
isEqual / isBefore / isAfter
→ câu hỏi trên Instant/dòng thời gian

equals
→ tính bằng nhau của cách biểu diễn đối tượng theo hợp đồng của kiểu

compareTo
→ thứ tự tự nhiên của kiểu; có tiêu chí phân định để nhất quán với tính bằng nhau
→ không nên giả định đây là "bộ so sánh chỉ theo Instant"
```

Ở đây:

```text
thứ tự tự nhiên
→ thứ tự mặc định mà compareTo(...) định nghĩa cho kiểu

tiêu chí phân định
→ tiêu chí phụ chỉ được dùng khi tiêu chí so sánh trước đó bằng nhau
```

Nếu logic nghiệp vụ chỉ quan tâm thứ tự trên dòng thời gian, `toInstant()` hoặc các phương thức `isBefore` / `isAfter` / `isEqual` làm ý định rõ hơn.

**Ranh giới nâng cao — hợp đồng chính xác:** người mới chỉ cần nắm quy tắc ở trên trước; phần dưới hữu ích khi mã sắp xếp hoặc bộ so sánh cần tuân thủ chính xác hợp đồng của kiểu.

```text
OffsetDateTime.equals(...)
→ cùng ngày-giờ cục bộ + cùng độ lệch

ZonedDateTime.equals(...)
→ cùng ngày-giờ cục bộ + cùng độ lệch + cùng ZoneId

isEqual / isBefore / isAfter
→ so theo Instant trên dòng thời gian

OffsetDateTime.compareTo(...)
→ trước hết so instant
→ nếu cùng Instant thì dùng ngày-giờ cục bộ làm tiêu chí phân định

ZonedDateTime.compareTo(...)
→ trước hết so instant
→ rồi ngày-giờ cục bộ
→ rồi ZoneId
→ hệ lịch (chronology) là tiêu chí phân định cuối trong hợp đồng ChronoZonedDateTime
```

Do đó hai giá trị có thể **cùng Instant nhưng `compareTo(...) != 0`**. Nếu cần bộ so sánh chỉ theo dòng thời gian, `OffsetDateTime.timeLineOrder()` và `ChronoZonedDateTime.timeLineOrder()` tồn tại đúng cho mục đích đó.

### Các giá trị cục bộ bằng nhau không tạo ra ý nghĩa toàn cục

```java
LocalDateTime vietnamNine = LocalDateTime.of(2026, 10, 5, 9, 0);
LocalDateTime parisNine = LocalDateTime.of(2026, 10, 5, 9, 0);
```

Hai giá trị bằng nhau về các trường cục bộ nhưng không chứng minh hai sự kiện ở Việt Nam và Paris xảy ra cùng `Instant`. Ngữ cảnh múi giờ phải được thêm trước.
