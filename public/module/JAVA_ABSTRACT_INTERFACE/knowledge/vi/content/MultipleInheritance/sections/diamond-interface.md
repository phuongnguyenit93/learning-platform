Hình kim cương tự thân không đồng nghĩa với xung đột.

Nếu nhiều đường kế thừa cuối cùng cùng dẫn đến một phương thức `default` cụ thể nhất (most-specific), hợp đồng vẫn rõ ràng. Xung đột chỉ xuất hiện khi nhiều phương thức `default` độc lập cạnh tranh mà không có phương thức nào cụ thể hơn.

Mô hình tư duy của phần này là:

```text
đa kế thừa qua interface
→ kết hợp nhiều kiểu/hợp đồng
→ có thể nhận hành vi default
→ interface không đóng góp trạng thái riêng cho từng đối tượng; đây không phải đa kế thừa lớp
→ khi các default cạnh tranh, Java dùng độ cụ thể + ưu tiên hệ phân cấp lớp + ghi đè tường minh
```

Sau khi hiểu các quy tắc xung đột, bước cuối là nối toàn bộ module thành một mô hình thiết kế: chọn cơ chế nào, kết hợp chúng ra sao và cần kiểm tra gì khi interface bắt đầu có hệ phân cấp và hành vi mặc định.
