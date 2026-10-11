`ZoneId` có thể biểu diễn một múi giờ theo độ lệch cố định hoặc một vùng có tên. Khi nghiệp vụ cần quy tắc thay đổi theo lịch sử/chính sách, ta thường dùng định danh vùng như:

```java
ZoneId vietnam = ZoneId.of("Asia/Ho_Chi_Minh");
ZoneId paris = ZoneId.of("Europe/Paris");
ZoneId newYork = ZoneId.of("America/New_York");
```

Tên vùng không chỉ là nhãn để hiển thị. Nó cho phép Java tra **bộ quy tắc múi giờ** tương ứng.

### Tránh mã múi giờ viết tắt mơ hồ

Các viết tắt ba chữ như `CST`, `EST`, `IST` nhìn ngắn nhưng **không phải định danh vùng toàn cầu đáng tin cậy**; cùng một dạng viết tắt có thể được hiểu khác nhau theo hệ thống hoặc khu vực. Với nghiệp vụ thật, ưu tiên định danh vùng kiểu IANA dạng `Area/City` như:

```text
Asia/Ho_Chi_Minh
Europe/Paris
America/New_York
```

Java có các ánh xạ tương thích như `ZoneId.SHORT_IDS`, và API cũ `TimeZone` cũng hỗ trợ nhiều mã viết tắt. Đây là cơ chế tương thích riêng, không có nghĩa lời gọi một tham số như `ZoneId.of("EST")` luôn hợp lệ. Với dữ liệu nghiệp vụ, hãy ưu tiên định danh vùng rõ ràng nếu hợp đồng có thể lưu/trao đổi `ZoneId`.

So sánh:

```text
+01:00
→ chỉ biết độ lệch hiện tại/cụ thể

Europe/Paris
→ biết vùng
→ bộ quy tắc có thể xác định độ lệch đúng cho từng ngày-giờ cục bộ/Instant
```

Vì DST hoặc thay đổi pháp lý, độ lệch của một vùng có thể khác nhau theo ngày.

**DST (Daylight Saving Time)** là chính sách mà một số khu vực điều chỉnh đồng hồ cục bộ trong một phần của năm. Không phải quốc gia/vùng nào cũng dùng DST, và quy tắc có thể thay đổi theo quyết định pháp lý; vì vậy mã không nên tự ghi cứng “mùa hè luôn +1 giờ”.

### Chọn ZoneOffset hay ZoneId?

```text
Hợp đồng bên ngoài chỉ sở hữu một độ lệch cụ thể như +07:00
→ ZoneOffset

Nghiệp vụ sở hữu một khu vực thật và cần quy tắc theo lịch sử/tương lai
→ ZoneId theo vùng

Cần một mốc sự kiện toàn cục, không cần giữ định danh cục bộ/múi giờ
→ thường chuyển về Instant
```

Đừng nâng một `ZoneOffset` thành `ZoneId` bằng suy đoán. `+07:00` có thể khớp nhiều nơi và không chứa đủ thông tin để biết vùng ban đầu.

### Múi giờ mặc định của hệ thống

```java
ZoneId systemZone = ZoneId.systemDefault();
```

API này tiện nhưng đưa môi trường chạy vào logic nghiệp vụ. Chạy cùng mã ở máy phát triển, CI và môi trường thực tế với mặc định múi giờ khác nhau có thể cho kết quả khác. Nếu nghiệp vụ biết múi giờ, nên truyền múi giờ/cấu hình rõ ràng thay vì dựa vào mặc định ngầm.
