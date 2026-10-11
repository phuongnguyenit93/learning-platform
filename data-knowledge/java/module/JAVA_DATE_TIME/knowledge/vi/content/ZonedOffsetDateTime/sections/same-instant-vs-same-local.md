Hai giá trị có múi giờ có thể khác đồng hồ cục bộ nhưng cùng `Instant`:

```java
ZonedDateTime vietnam = ZonedDateTime.of(
        2026, 10, 5, 9, 0, 0, 0,
        ZoneId.of("Asia/Ho_Chi_Minh")
);

ZonedDateTime parisSameInstant = vietnam.withZoneSameInstant(
        ZoneId.of("Europe/Paris")
);
```

Hai đối tượng hiển thị các trường cục bộ khác nhau nhưng:

```java
vietnam.toInstant().equals(parisSameInstant.toInstant()); // true
```

Ngược lại, ta có thể cố giữ cùng các trường cục bộ ở hai múi giờ:

```text
09:00 Vietnam
09:00 Paris
```

thì phần lớn chúng là **hai `Instant` khác nhau**.

Mô hình tư duy:

```text
cùng Instant
→ giữ vị trí trên dòng thời gian
→ đồng hồ cục bộ phải thay đổi khi đổi múi giờ

cùng giá trị cục bộ
→ giữ các trường lịch/đồng hồ
→ vị trí trên dòng thời gian có thể thay đổi
```

Đây là lý do “chuyển đổi múi giờ” phải nói rõ muốn bảo toàn điều gì.
