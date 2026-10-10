Chuỗi chứa thông tin nào thì kiểu đích phải phù hợp.

```java
LocalDate date = LocalDate.parse("2026-09-27");
LocalDateTime local = LocalDateTime.parse("2026-09-27T14:30:00");
OffsetDateTime offset = OffsetDateTime.parse("2026-09-27T14:30:00+07:00");
ZonedDateTime zoned = ZonedDateTime.parse("2026-09-27T14:30:00+07:00[Asia/Ho_Chi_Minh]");
Instant instant = Instant.parse("2026-09-27T07:30:00Z");
```

### Đừng phân tích chuỗi rồi vứt mất thông tin

Nếu đầu vào có độ lệch UTC:

```text
2026-09-27T14:30:00+07:00
```

phân tích thành `LocalDateTime` sau khi tự cắt phần `+07:00` sẽ làm mất ngữ cảnh dòng thời gian. Hãy phân tích thành `OffsetDateTime` hoặc kiểu phù hợp trước, rồi chuyển đổi có chủ đích.

### Đừng tự tạo thông tin mà chuỗi đầu vào không có

Nếu đầu vào chỉ là:

```text
2026-09-27T14:30:00
```

không được tự kết luận đó là UTC hoặc múi giờ mặc định hệ thống trừ khi hợp đồng bên ngoài nói như vậy.

Mô hình tư duy:

```text
những trường thực sự có trong chuỗi
        ↓
phân tích vào kiểu giữ đúng ý nghĩa
        ↓
chỉ bổ sung múi giờ/độ lệch khi hợp đồng hoặc nghiệp vụ cung cấp
```

Sau khi đối tượng đã được phân tích đúng, bước tiếp theo là phép toán và so sánh: cùng là cộng/trừ/so sánh nhưng mỗi kiểu thời gian có ý nghĩa riêng.
