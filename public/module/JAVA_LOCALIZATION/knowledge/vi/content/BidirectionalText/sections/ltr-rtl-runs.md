Một đoạn văn bidi có thể được chia thành các **đoạn có hướng (directional runs)**: các đoạn liên tiếp có cùng mức nhúng/hướng trong kết quả phân tích.

Mô hình tư duy:

```text
đoạn văn
  ├─ đoạn A → RTL
  ├─ đoạn B → LTR (ví dụ số/mã)
  └─ đoạn C → RTL
```

Các khái niệm người mới cần biết:

```text
hướng nền (base direction)
→ hướng nền của đoạn văn

đoạn LTR
→ đoạn được xử lý theo hướng trái sang phải

đoạn RTL
→ đoạn được xử lý theo hướng phải sang trái

mức nhúng (embedding level)
→ mức dùng bởi thuật toán bidi để xác định thứ tự của các đoạn
```

Lập trình viên không cần tự triển khai Unicode Bidirectional Algorithm. Điều quan trọng là biết **văn bản trộn nhiều hướng có cấu trúc riêng**, không phải chỉ có một boolean `isRtl` cho toàn chuỗi.
