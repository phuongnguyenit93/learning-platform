# Các thao tác String cốt lõi

Sau khi hiểu `String` là bất biến và biết cách so sánh theo nội dung, bước tiếp theo là học cách **đọc, tìm kiếm, cắt, biến đổi và kết hợp văn bản** bằng những API cốt lõi. Mục tiêu của chương này không phải ghi nhớ toàn bộ `java.lang.String`, mà là xây một mô hình tư duy để chọn đúng nhóm thao tác cho câu hỏi đang giải quyết.

```text
Tôi muốn làm gì với văn bản?
        ↓
kiểm tra
        ↓
tìm kiếm
        ↓
trích xuất
        ↓
biến đổi
        ↓
tách / ghép
        ↓
chuyển đổi / định dạng
```

Hầu hết thao tác tạo nội dung khác đều trả về **String mới**. String ban đầu vẫn không thay đổi.
