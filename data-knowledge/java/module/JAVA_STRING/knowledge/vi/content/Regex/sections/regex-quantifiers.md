Lượng từ như `*`, `+`, `{m,n}` mặc định thường tham lam: cố lấy nhiều đầu vào nhất rồi quay lui nếu cần.

Biến thể không tham lam như `*?`, `+?` bắt đầu với ít đầu vào hơn rồi mở rộng khi cần.

Java còn có **lượng từ chiếm hữu (possessive quantifier)** như `*+`, `++`, không quay lui phần đã tiêu thụ. Nó có thể hữu ích để kiểm soát backtracking khi ngữ nghĩa phù hợp, nhưng không phải “phiên bản nhanh hơn” có thể thay thế lượng từ tham lam một cách máy móc.

Sự khác biệt này ảnh hưởng kết quả khi nhiều vị trí so khớp có thể hợp lệ. Hãy đọc Regex cùng đầu vào ví dụ thay vì chỉ nhìn cú pháp riêng lẻ.

Ví dụ:

```text
đầu vào: <a><b>

<.*>
→ tham lam, có thể lấy <a><b>

<.*?>
→ không tham lam, phần khớp đầu tiên có thể là <a>
```
