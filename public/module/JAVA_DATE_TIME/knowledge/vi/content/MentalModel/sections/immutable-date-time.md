Các lớp ngày-giờ chính như `LocalDate`, `LocalTime`, `LocalDateTime`, `Instant`, `ZonedDateTime`, `Duration` và `Period` được thiết kế theo hướng **bất biến**: một đối tượng đã tạo không bị thay đổi nội dung bởi các thao tác như `plusDays` hay `minusHours`.

Ví dụ:

```java
LocalDate original = LocalDate.of(2026, 10, 5);
LocalDate nextDay = original.plusDays(1);

System.out.println(original); // 2026-10-05
System.out.println(nextDay);  // 2026-10-06
```

`plusDays(1)` không sửa `original`. Nó trả về một giá trị mới.

Điều này quan trọng vì các giá trị ngày-giờ thường được truyền qua nhiều tầng. Nếu một phương thức có thể âm thầm sửa đối tượng dùng chung, việc suy luận về thời gian sẽ rất khó:

```text
dịch vụ A nhận ngày
        ↓
dịch vụ B cộng thêm 1 ngày ngay trên cùng đối tượng
        ↓
dịch vụ A bỗng thấy dữ liệu thay đổi
```

Giá trị bất biến tránh kiểu tác dụng phụ đó và phù hợp với cách ta nhìn ngày/giờ như **giá trị** hơn là đối tượng có vòng đời và trạng thái có thể thay đổi.

### Kiểu dựa trên giá trị: so giá trị, đừng dựa vào định danh đối tượng

Nhiều lớp chính của `java.time` được thiết kế như **lớp dựa trên giá trị**. Ứng dụng nên coi hai đối tượng mang cùng giá trị là tương đương về mặt nghiệp vụ:

```java
LocalDate a = LocalDate.of(2026, 10, 5);
LocalDate b = LocalDate.of(2026, 10, 5);

boolean sameValue = a.equals(b); // true
```

Không viết logic dựa vào `a == b`, định danh đối tượng hoặc dùng đối tượng ngày-giờ làm monitor (khóa đồng bộ) cho `synchronized`. Hợp đồng API quan tâm **giá trị**, không hứa về định danh của từng đối tượng.

Tính bất biến cũng giúp các kiểu giá trị chính được chia sẻ an toàn giữa nhiều đoạn mã/luồng theo hợp đồng an toàn đa luồng của chúng, thay vì cần kiểm soát thay đổi phòng vệ như API cũ có thể thay đổi trạng thái.

### Các thao tác `with` / `plus` / `minus`

Hãy đọc các phương thức này theo quy tắc:

```text
withX(...)
→ tạo giá trị mới với một trường được thay thế/điều chỉnh

plusX(...)
→ tạo giá trị mới sau khi cộng

minusX(...)
→ tạo giá trị mới sau khi trừ
```

Ví dụ:

```java
LocalDateTime meeting = LocalDateTime.of(2026, 10, 5, 9, 0);

LocalDateTime moved = meeting
        .withHour(10)
        .plusDays(2);
```

`meeting` vẫn là `2026-10-05T09:00`; `moved` là giá trị khác.

Đừng quên gán kết quả:

```java
meeting.plusDays(1); // kết quả bị bỏ đi
```

Đây là lỗi rất phổ biến khi người học quen với API có thể thay đổi.
