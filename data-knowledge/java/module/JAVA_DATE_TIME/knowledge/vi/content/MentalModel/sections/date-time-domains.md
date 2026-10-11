### Ngày và thời gian trong phần mềm thực ra là gì?

Ở mức đơn giản nhất, **ngày-giờ là nhóm khái niệm và API dùng để mô hình hóa ngày, giờ, thời điểm, múi giờ và khoảng thời gian trong chương trình**.

Nó không chỉ trả lời một câu hỏi “mấy giờ rồi?”. Một ứng dụng có thể cần trả lời nhiều loại câu hỏi khác nhau:

```text
Ngày nào?
→ ngày theo lịch

Mấy giờ trong ngày?
→ giờ theo đồng hồ cục bộ

Sự kiện xảy ra chính xác lúc nào trên dòng thời gian?
→ Instant

Giờ địa phương đó thuộc khu vực nào?
→ múi giờ

Hai thời điểm cách nhau bao lâu?
→ Duration / Period

Làm sao đổi đối tượng thời gian thành văn bản và ngược lại?
→ định dạng / phân tích chuỗi
```

Vì những câu hỏi này có ý nghĩa khác nhau, Java không cố ép chúng vào một lớp duy nhất.

### `java.time` là gì và tại sao Java cần nó?

`java.time` là **API ngày-giờ hiện đại của Java**, xuất hiện từ Java 8 và là API chính để mã mới biểu diễn ngày, giờ, `Instant`, khoảng thời gian và múi giờ.

Trước đó Java đã có những API như `java.util.Date` và `Calendar`. Chúng vẫn tồn tại vì tương thích, nhưng có nhiều đặc điểm khó dùng cho mã hiện đại: tên/kiểu không diễn đạt nghiệp vụ rõ bằng `LocalDate`/`Instant`, nhiều API có thể thay đổi, và việc xử lý lịch/múi giờ dễ dựa vào trạng thái/mặc định ngầm.

`java.time` cải thiện bài toán theo hướng:

```text
Mỗi loại ý nghĩa thời gian
→ một kiểu rõ ràng

Các giá trị ngày-giờ chính
→ bất biến

Múi giờ / độ lệch UTC
→ mô hình riêng thay vì giả định ẩn

Định dạng / phân tích chuỗi
→ API riêng, bộ định dạng có thể tái sử dụng an toàn

"thời điểm hiện tại"
→ có Clock để biến nguồn thời gian thành phụ thuộc rõ ràng
```

Nói ngắn gọn:

> **Vai trò của `java.time` là giúp mã biểu diễn đúng loại thông tin thời gian mà nghiệp vụ thực sự sở hữu, rồi cung cấp các thao tác chuẩn để tạo, chuyển đổi, tính toán, so sánh, định dạng và phân tích các giá trị đó.**

### API ngày-giờ gồm những nhóm thành phần nào?

Không cần thuộc hết lớp ngay. Hãy nhìn API theo **vai trò**:

```text
1. Giá trị theo lịch / đồng hồ cục bộ
   ├── LocalDate
   ├── LocalTime
   └── LocalDateTime

2. Dòng thời gian toàn cục
   └── Instant

3. Múi giờ / độ lệch UTC
   ├── ZoneId
   ├── ZoneOffset
   ├── ZonedDateTime
   ├── OffsetDateTime
   └── OffsetTime

4. Lượng thời gian
   ├── Duration
   └── Period

5. Các khái niệm lịch nhỏ hơn
   ├── Year
   ├── YearMonth
   ├── MonthDay
   ├── Month
   └── DayOfWeek

6. Ranh giới văn bản
   └── DateTimeFormatter / DateTimeFormatterBuilder

7. Nguồn thời gian hiện tại
   └── Clock

8. Các API dùng chung hỗ trợ
   ├── Temporal / TemporalAccessor
   ├── TemporalAmount / TemporalUnit
   ├── ChronoUnit
   ├── TemporalAdjuster / TemporalAdjusters
   └── ZoneRules
```

Các API dùng chung ở nhóm 8 giúp nhiều kiểu ngày-giờ dùng chung từ vựng. Người mới **không cần học chúng trước các kiểu chính**; chỉ cần biết chúng tồn tại để khi gặp chữ ký như `plus(TemporalAmount)` hay `get(TemporalField)` trong Javadoc không tưởng đó là một hệ thống hoàn toàn khác.

Đọc nhanh các thành phần này như sau:

| Khái niệm trừu tượng | Vai trò đơn giản |
| --- | --- |
| `TemporalAccessor` | đối tượng cho phép **đọc** trường thời gian mà nó hỗ trợ |
| `Temporal` | đối tượng thời gian có từ vựng chung cho `with`, `plus`, `minus`, `until` |
| `TemporalField` / `ChronoField` | mô tả **trường nào** đang được hỏi, ví dụ ngày trong tháng hoặc giờ trong ngày |
| `TemporalUnit` / `ChronoUnit` | mô tả **đơn vị nào**, ví dụ DAYS, HOURS, MONTHS |
| `TemporalAmount` | một **lượng có cấu trúc**, điển hình là `Duration` hoặc `Period` |
| `TemporalAdjuster` | chiến lược/đối tượng biết cách điều chỉnh một giá trị thời gian |
| `TemporalAdjusters` | tiện ích cung cấp các bộ điều chỉnh thường dùng như ngày cuối tháng |
| `TemporalQuery` | chiến lược để truy vấn/lấy thông tin từ một đối tượng thời gian |

Đây là **từ vựng API dùng chung**, không phải tám loại “thời gian” mới. Hãy học `LocalDate`, `Instant`, múi giờ, `Duration`... trước; các thành phần này sẽ dần có ý nghĩa khi gặp lại trong chữ ký phương thức.

Về gói, API cũng được chia theo trách nhiệm:

```text
java.time
→ các kiểu chính

java.time.format
→ định dạng / phân tích chuỗi

java.time.temporal
→ trường, đơn vị, truy vấn, bộ điều chỉnh và các API dùng chung

java.time.zone
→ quy tắc múi giờ và lần chuyển đổi

java.time.chrono
→ hệ lịch khác ISO; là ranh giới nâng cao, không phải lộ trình học chính của mô-đun này
```

### ISO-8601 và UTC — đọc ký hiệu trước khi đọc mã

**ISO-8601** là tiêu chuẩn quốc tế mô tả cách biểu diễn ngày và thời gian theo một quy ước thống nhất. Các kiểu chính như `LocalDate`, `LocalTime` và `LocalDateTime` dùng mô hình lịch ISO, và nhiều bộ định dạng mặc định của `java.time` sử dụng dạng văn bản ISO-8601.

Trong mô-đun, bạn sẽ thường thấy những chuỗi như:

```text
2026-10-05
→ ngày

09:30:15
→ giờ

2026-10-05T09:30:15
→ chữ T ngăn phần ngày và giờ

2026-10-05T02:30:15Z
→ Z nghĩa là độ lệch +00:00, tức UTC

2026-10-05T09:30:15+07:00
→ ngày-giờ cục bộ + độ lệch +07:00

2026-10-05T09:30:15+07:00[Asia/Ho_Chi_Minh]
→ các trường cục bộ + độ lệch đã xác định + ZoneId theo vùng
```

**UTC (Coordinated Universal Time)** là mốc tham chiếu toàn cầu mà độ lệch UTC được tính tương đối so với nó. UTC không phải “múi giờ địa phương của mọi người”; nó là tham chiếu giúp nhiều hệ thống nói về cùng dòng thời gian.

Ở đây **dòng thời gian** có thể hiểu đơn giản là một đường khái niệm sắp các thời điểm theo thứ tự trước → sau; một `Instant` xác định một vị trí trên đường đó.

`LocalDate`, `LocalDateTime` và các kiểu `Local*` tương ứng là **các kiểu lịch ISO**; chúng không phải đối tượng có thể đổi sang hệ lịch khác bằng cấu hình. Trong API nâng cao, thuật ngữ **chronology** chỉ hệ lịch/quy tắc lịch đang được dùng. Nếu ứng dụng thật sự cần hệ lịch khác ISO, `java.time.chrono` có các kiểu và API riêng như `ChronoLocalDate`. Đổi `Locale` để hiển thị văn bản cũng không biến một `LocalDate` thành hệ lịch khác.

### Các ngoại lệ thường gặp trong java.time

Người mới sẽ gặp một vài ngoại lệ lặp lại trong mô-đun:

```text
DateTimeException
→ ngoại lệ nền tảng khi chạy chương trình cho nhiều lỗi ngày-giờ

DateTimeParseException
→ phân tích văn bản thất bại
→ là một DateTimeException

UnsupportedTemporalTypeException
→ kiểu thời gian không hỗ trợ trường/đơn vị đang yêu cầu
→ cũng là một DateTimeException
```

Ví dụ `LocalDate.of(2026, 2, 30)` có thể ném `DateTimeException`; phân tích văn bản sai có thể ném `DateTimeParseException`; yêu cầu `HOURS` trên `LocalDate` có thể dẫn tới `UnsupportedTemporalTypeException`.

### KHÁI NIỆM — “thời gian” không phải chỉ có một nghĩa

Trong Java hiện đại, `java.time` không có một lớp duy nhất đại diện cho mọi khái niệm thời gian. Thay vào đó, mỗi kiểu giữ một **ý nghĩa nghiệp vụ cụ thể**.

Mô hình tư duy cơ bản:

```text
LocalDate
→ ngày trên lịch
→ 2026-10-05

LocalTime
→ giờ trong ngày
→ 09:00

LocalDateTime
→ ngày + giờ địa phương
→ 2026-10-05T09:00
→ vẫn chưa nói nơi nào trên Trái Đất

Instant
→ một điểm chính xác trên dòng thời gian UTC
→ có thể so sánh tuyệt đối giữa các hệ thống

ZoneOffset
→ độ lệch cụ thể so với UTC, ví dụ +07:00

ZoneId
→ tên vùng chứa tập quy tắc múi giờ, ví dụ Asia/Ho_Chi_Minh

ZonedDateTime
→ ngày + giờ địa phương + ZoneId

OffsetDateTime
→ ngày + giờ địa phương + một ZoneOffset cụ thể
```

Điểm quan trọng là mỗi kiểu **cố ý không biết** một số thông tin.

Ví dụ:

```java
LocalDate birthday = LocalDate.of(1993, 7, 20);
```

Ngày sinh không cần phải biết “múi giờ UTC+7” hay “lúc 00:00”. Gắn các thông tin đó vào sẽ tạo ra dữ liệu giả mà nghiệp vụ không hề sở hữu.

Ngược lại:

```java
Instant receivedAt = Instant.now();
```

Một sự kiện kiểm toán (audit) cần biết yêu cầu xảy ra tại điểm nào trên dòng thời gian, nên `Instant` phù hợp hơn `LocalDateTime`.

### VÌ SAO — một “dấu thời gian” chung gây vấn đề gì?

Giả sử ta chỉ lưu:

```text
2026-11-01 01:30
```

Giá trị này chưa đủ để biết một `Instant` toàn cục. Nó không nói `01:30` ở Việt Nam, New York hay London. Ở vùng có DST, cùng một giờ địa phương thậm chí có thể xuất hiện hai lần trong ngày chuyển từ giờ mùa hè về giờ chuẩn.

Ngược lại, nếu ta lưu mọi thứ thành mili giây tính từ epoch, ta lại làm mất ý nghĩa tự nhiên của một số nghiệp vụ:

```text
Sinh nhật 20/07
Giờ mở cửa 08:30
Ngày chốt sổ cuối tháng
```

Những khái niệm này trước hết là **giá trị theo lịch hoặc đồng hồ cục bộ**, không phải “một số mili giây kể từ epoch”.

Vì thế `java.time` tách nghiệp vụ thành các kiểu rõ ràng thay vì khuyến khích một kiểu đa năng.

### Thời gian theo lịch của con người và dòng thời gian toàn cục

Có thể chia tư duy thành hai phía lớn:

```text
Lịch / đồng hồ cục bộ cho con người
├── LocalDate
├── LocalTime
└── LocalDateTime

Dòng thời gian toàn cục của hệ thống
└── Instant

Cầu nối giữa hai phía
├── ZoneId / ZoneRules
├── ZoneOffset
├── ZonedDateTime
└── OffsetDateTime
```

Ví dụ một cuộc họp:

```java
LocalDateTime localMeeting = LocalDateTime.of(2026, 10, 5, 9, 0);
ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
ZonedDateTime scheduled = localMeeting.atZone(zone);
Instant globalPoint = scheduled.toInstant();
```

Luồng tư duy:

```text
Người dùng nói: 09:00 ngày 05/10/2026
        ↓
LocalDateTime
        ↓ thêm nơi/quy tắc múi giờ
ZoneId
        ↓
ZonedDateTime
        ↓ quy về dòng thời gian chung
Instant
```

Đây là xương sống của toàn mô-đun.
