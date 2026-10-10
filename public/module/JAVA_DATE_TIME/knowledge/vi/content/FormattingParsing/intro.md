# Định dạng và phân tích chuỗi ngày-giờ

Đối tượng ngày-giờ và văn bản là hai cách biểu diễn khác nhau. Đối tượng như `LocalDate` hay `Instant` giữ ý nghĩa thời gian; chuỗi như `27/09/2026`, `2026-09-27` hay `09:30 AM` chỉ là **cách biểu diễn** dùng ở giao diện, tệp, API hoặc giao thức.

Sai lầm phổ biến là để hình dạng chuỗi định dạng trở thành “mô hình thời gian”. Chương này tách rõ hai việc:

```text
format (định dạng)
→ đối tượng thời gian → văn bản

parse (phân tích)
→ văn bản → đối tượng thời gian
```
