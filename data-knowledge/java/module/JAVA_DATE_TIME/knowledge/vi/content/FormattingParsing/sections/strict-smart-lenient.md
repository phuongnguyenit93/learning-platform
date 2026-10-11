Phân tích chuỗi không chỉ là tách ký tự. Sau khi đọc các trường, Java còn phải **phân giải** chúng thành một giá trị thời gian hợp lệ.

Ba chế độ phân giải chính:

```text
STRICT
→ yêu cầu các trường hợp lệ chính xác theo quy tắc

SMART
→ cho phép một số điều chỉnh hợp lý theo ý nghĩa của bộ định dạng

LENIENT
→ cho phép tràn giá trị và chuẩn hóa rộng hơn
```

Với bộ định dạng tạo bằng `DateTimeFormatter.ofPattern(...)`, **chế độ phân giải mặc định là `SMART`**. Các bộ định dạng dựng sẵn có thể mang cấu hình phân giải riêng, vì vậy đừng suy rộng rằng mọi `DateTimeFormatter` đều mặc định `SMART`. Nếu hợp đồng đầu vào yêu cầu từ chối dữ liệu lịch không hợp lệ một cách chặt chẽ, hãy kiểm tra hoặc cấu hình `ResolverStyle` có chủ đích.

Ví dụ:

```java
DateTimeFormatter strict = DateTimeFormatter
        .ofPattern("dd/MM/uuuu")
        .withResolverStyle(ResolverStyle.STRICT);

LocalDate.parse("31/02/2026", strict); // DateTimeParseException
```

Với đầu vào từ người dùng/API có hợp đồng chặt, `STRICT` thường dễ suy luận hơn vì dữ liệu lịch không hợp lệ bị từ chối thay vì âm thầm điều chỉnh.

### SMART không thay thế kiểm tra quy tắc nghiệp vụ

Ngay cả phân tích thành công, dữ liệu có thể vẫn vi phạm quy tắc ứng dụng:

```text
ngày hợp lệ trên lịch
≠
ngày hợp lệ cho đặt lịch
```

Ví dụ ngày đặt lịch có thể phải nằm trong 90 ngày tới hoặc không rơi vào ngày nghỉ. `DateTimeFormatter` chỉ xử lý văn bản ngày-giờ, không thay thế kiểm tra nghiệp vụ.
