Cùng một văn bản nhìn giống nhau có thể được biểu diễn bằng các chuỗi điểm mã khác nhau.

Ví dụ một ký tự có dấu có thể tồn tại dưới dạng:

```text
điểm mã dựng sẵn (precomposed)
hoặc
ký tự cơ sở + dấu kết hợp
```

`java.text.Normalizer` hỗ trợ các dạng chuẩn hóa như NFC/NFD.

Các dạng chính:

```text
NFD
→ phân rã chuẩn tắc (canonical decomposition)

NFC
→ phân rã chuẩn tắc rồi kết hợp lại

NFKD
→ phân rã tương thích (compatibility decomposition)

NFKC
→ phân rã tương thích rồi kết hợp lại
```

NFKC/NFKD có thể làm mất thêm các khác biệt mang tính tương thích/trình bày so với chuẩn hóa chuẩn tắc, nên không chọn chúng chỉ vì tưởng rằng chúng “chuẩn hóa mạnh hơn”.

Chuẩn hóa là một **chính sách ranh giới**: chỉ chuẩn hóa khi trường hợp sử dụng cần hành vi so sánh/tìm kiếm/lưu trữ theo dạng chuẩn rõ ràng.

Đừng chuẩn hóa mù quáng mọi đầu vào. Mã định danh, token nhạy cảm về bảo mật, dữ liệu chữ ký số hoặc giao thức bên ngoài có thể yêu cầu giữ nguyên chuỗi chính xác.
