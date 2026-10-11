# Xử lý Annotation tại thời điểm biên dịch

Cho đến đây, ta đã thấy mã chạy ở thời gian chạy có thể đọc một Annotation `RUNTIME`. Nhưng có những bài toán **không nên đợi ứng dụng chạy**:

```text
siêu dữ liệu sai
→ muốn quá trình build thất bại ngay

boilerplate có thể suy ra từ mã nguồn
→ muốn sinh mã trước thời gian chạy

công cụ cần tạo tài nguyên/chỉ mục từ các khai báo
→ muốn đầu ra đó có sẵn sau khi biên dịch
```

Reflection ở thời gian chạy là quá muộn cho các bài toán này. Ta cần một thành phần đọc chạy **ngay trong quá trình biên dịch**.

Xử lý Annotation tại thời điểm biên dịch là cơ chế cho phép công cụ đọc Annotation trong mã nguồn/mô hình ngôn ngữ để:

- kiểm tra quy tắc;
- phát thông báo chẩn đoán của trình biên dịch;
- sinh mã nguồn/class file/tài nguyên mới.

Nó không cần ứng dụng chạy và không phải Reflection.

Một ví dụ thực tế:

```text
lập trình viên viết @GenerateMapper
        ↓
javac/công cụ biên dịch phát hiện processor
        ↓
processor đọc mô hình của type được gắn Annotation
        ↓
sinh OrderMapperGenerated.java
        ↓
mã nguồn được sinh tham gia quá trình biên dịch
```
