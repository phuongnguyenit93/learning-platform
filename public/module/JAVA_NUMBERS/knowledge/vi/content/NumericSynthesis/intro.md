# Chọn mô hình số phù hợp

Biết từng API số riêng lẻ vẫn chưa đủ. Trong mã nguồn thực tế, lỗi thường xuất hiện vì cách biểu diễn hoặc chính sách xử lý được chọn theo thói quen thay vì dựa trên yêu cầu của bài toán.

Chương này kết nối toàn bộ mô-đun thành một quá trình ra quyết định:

```text
yêu cầu của bài toán
        ↓
chọn cách biểu diễn số
        ↓
nhận diện cách nó có thể gây sai lệch hoặc thất bại
        ↓
làm rõ quy tắc so sánh / tràn số / làm tròn
        ↓
kiểm tra ranh giới với các mô-đun liên quan
```

Mục tiêu không phải ghi nhớ một kiểu số "tốt nhất" cho mọi trường hợp. Mục tiêu là giải thích được **vì sao cách biểu diễn và các chính sách này phù hợp với giá trị đang xử lý**.
