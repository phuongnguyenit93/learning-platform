Chọn đúng kiểu dữ liệu chưa kết thúc việc thiết kế.

Ví dụ, yêu cầu sau vẫn chưa đầy đủ:

```text
"Tiền dùng BigDecimal"
```

Nghiệp vụ vẫn có thể phải quy định:

```text
scale của dữ liệu đầu vào
precision trung gian
RoundingMode
thời điểm làm tròn
quy tắc bằng nhau / chuẩn hóa
ranh giới lưu trữ dữ liệu
```

Tương tự, chọn `long` chưa trả lời việc tràn số nên được phép quay vòng, phải phát sinh lỗi hay phải được chặn bằng kiểm tra điều kiện đầu vào. Chọn `double` chưa xác định sai số so sánh. Chọn `SecureRandom` cũng chưa định nghĩa một giao thức mật mã an toàn.

Hãy tách thành hai lớp:

```text
cách biểu diễn
→ biểu diễn được những giá trị nào và phép toán tuân theo mô hình nào?

chính sách xử lý
→ ứng dụng yêu cầu hành vi gì tại những ranh giới có rủi ro?
```

Một số vấn đề sâu hơn thuộc trách nhiệm chính của mô-đun khác:

```text
quy tắc equals / hashCode / thứ tự
→ Object Contract

hành vi của cấu trúc dữ liệu dựa trên hash hoặc có sắp xếp
→ Collection

định dạng số / tiền tệ theo ngôn ngữ và khu vực
→ Localization

khóa / IV / nonce / mã hóa / chữ ký
→ Security & Cryptography
```

Numbers cần giải thích hệ quả liên quan đến số rồi chuyển tiếp sang mô-đun sở hữu chủ đề sâu hơn, thay vì lặp lại toàn bộ kiến thức của mô-đun khác.
