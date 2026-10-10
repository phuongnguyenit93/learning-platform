`Bidi` **không phải bộ dựng hiển thị văn bản**.

Nó phân tích cấu trúc/hướng để bộ dựng hiển thị hoặc bộ công cụ UI biết cách xử lý thứ tự. Việc chọn phông chữ, tạo hình ký tự, đo chiều rộng, bố trí điểm ảnh (pixel) và vẽ văn bản thuộc tầng dựng hiển thị/UI.

Ranh giới trách nhiệm nên hiểu là:

```text
String
→ giữ văn bản theo thứ tự logic

java.text.Bidi
→ phân tích hướng / các đoạn

bộ dựng UI / bộ máy bố trí
→ tạo kết quả hiển thị thực tế
```

Trong nhiều ứng dụng Java hiện đại, khung làm việc/bộ công cụ UI xử lý bidi tự động. Phần xử lý phía máy chủ thường không cần tự gọi `Bidi`. Nhưng lập trình viên làm quốc tế hóa vẫn cần hiểu nguyên tắc để tránh các cách làm sai như:

```text
đảo ngược chuỗi tiếng Ả Rập/tiếng Do Thái bằng tay
giả định mọi văn bản hiển thị trái sang phải
gắn dấu câu bằng thao tác chuỗi theo vị trí hiển thị
coi chuỗi trộn nhiều hướng như một khối RTL đồng nhất
```

Một nguyên tắc cuối cùng:

```text
nội dung logic
→ giữ đúng dữ liệu Unicode

phân tích hướng
→ để quy tắc bidi Unicode / API chuẩn xử lý

bố trí hiển thị
→ để bộ dựng hiển thị chịu trách nhiệm
```

Sau khi hoàn tất phần xử lý văn bản dành cho con người, cột mốc cuối quay lại các **chính sách an toàn của toàn mô-đun**: cơ chế dự phòng của `ResourceBundle`, Locale mặc định, dữ liệu dành cho máy và các lỗi bản địa hóa thường gặp.
