### java.util.Date

Tên `Date` dễ gây hiểu nhầm: `java.util.Date` không phải kiểu ngày theo lịch hiện đại giống `LocalDate`. Nó chủ yếu biểu diễn một mốc thời gian dựa trên mili giây từ epoch và có API cũ, có thể thay đổi trạng thái.

```java
Date legacy = new Date();
```

Nhiều getter/setter kiểu lịch của `Date` đã bị đánh dấu lỗi thời từ lâu; mã mới nên ưu tiên `java.time`.

### Calendar

`Calendar` cung cấp các trường theo lịch, múi giờ và phép toán theo kiểu có thể thay đổi:

```java
Calendar calendar = Calendar.getInstance();
calendar.add(Calendar.DAY_OF_MONTH, 1);
```

Thao tác sửa trực tiếp đối tượng, khác mô hình tư duy bất biến của `java.time`.

Các API cũ vẫn xuất hiện ở ranh giới tích hợp với hệ thống cũ, nhưng đừng chọn chúng cho mã mới chỉ vì hệ thống đã có sẵn một vài phương thức dùng `Date`.

### SimpleDateFormat — bộ định dạng cũ, thay đổi được và không an toàn đa luồng

Mã cũ còn rất hay gặp `java.text.SimpleDateFormat`:

```java
SimpleDateFormat legacyFormatter = new SimpleDateFormat("dd/MM/yyyy");
```

Khác `DateTimeFormatter`, `SimpleDateFormat` là đối tượng **có thể thay đổi và không an toàn đa luồng**. Vì vậy cách chia sẻ một đối tượng `static` dùng chung giữa nhiều luồng có thể tạo tranh chấp dữ liệu và kết quả phân tích/định dạng khó đoán.

```text
SimpleDateFormat
→ bộ định dạng cũ
→ có thể thay đổi
→ không nên chia sẻ giữa nhiều luồng nếu không có đồng bộ phù hợp

DateTimeFormatter
→ bộ định dạng java.time hiện đại
→ bất biến + an toàn đa luồng
```

Khi chuyển mã sang API mới, ưu tiên `DateTimeFormatter`; chỉ giữ `SimpleDateFormat` ở ranh giới với hệ thống cũ khi API cũ bắt buộc.
