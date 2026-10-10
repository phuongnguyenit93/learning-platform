Một cách làm sai thường gặp:

```text
giá trị số/ngày giờ nghiệp vụ
→ định dạng cho người dùng
→ lưu/gửi như giá trị chuẩn
→ phân tích lại ở dịch vụ khác
```

Định dạng theo Locale được tối ưu cho **con người đọc**, không phải cho vòng chuyển đổi định dạng → phân tích giữa các hệ thống.

Ví dụ `1,234` có thể được hiểu khác tùy Locale. Ngày `03/04/2026` có thể gây nhầm ngày/tháng. Bộ định dạng còn có thể làm tròn hoặc bỏ thông tin mà UI không cần.

Thay vào đó:

```text
ranh giới dành cho máy
→ hợp đồng giá trị số/String trong JSON rõ ràng
→ ngày giờ ISO khi phù hợp
→ mã tiền tệ tường minh

ranh giới dành cho con người
→ NumberFormat / DateTimeFormatter / thông điệp theo Locale
```

Ngay cả khi định dạng rồi phân tích bằng cùng bộ định dạng, quá trình chuyển đổi hai chiều cũng không phải lúc nào bảo toàn chính xác đối tượng ban đầu vì phần hiển thị có thể cố ý giảm độ chính xác hoặc bỏ bớt trường.

### Danh sách kiểm tra khi rà soát mã bản địa hóa

```text
[ ] giá trị nghiệp vụ có đang bị lưu thành String đã định dạng không?
[ ] Locale có được truyền tường minh ở ranh giới dành cho người dùng không?
[ ] Locale có bị nhầm với ZoneId/Currency/quốc gia không?
[ ] định danh có gọi toLowerCase()/toUpperCase() bằng Locale mặc định không?
[ ] tuần tự hóa dành cho máy có vô tình dùng NumberFormat/DateFormat theo Locale không?
[ ] thông điệp có bị nối từ nhiều mảnh không?
[ ] mẫu MessageFormat có được kiểm thử dấu nháy đơn/tham số giữ chỗ không?
[ ] khóa bị thiếu/cơ chế dự phòng của ResourceBundle có được kiểm soát không?
[ ] việc sắp xếp dành cho người dùng có cần Collator không?
[ ] Quy tắc collation của DB và Java Collator có đang bị giả định là giống nhau không?
```
