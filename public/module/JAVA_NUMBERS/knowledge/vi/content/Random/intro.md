# Sinh số giả ngẫu nhiên

`Random` không tạo “ngẫu nhiên tuyệt đối”. Nó tạo một chuỗi **giả ngẫu nhiên (pseudo-random)** từ trạng thái nội bộ/giá trị khởi tạo (seed) theo một thuật toán xác định.

Điểm quan trọng là phân biệt:

```text
phân phối/tính ngẫu nhiên hữu ích cho bài toán
và
tính khó dự đoán phục vụ bảo mật
```

Hai nhóm yêu cầu này không giống nhau.
