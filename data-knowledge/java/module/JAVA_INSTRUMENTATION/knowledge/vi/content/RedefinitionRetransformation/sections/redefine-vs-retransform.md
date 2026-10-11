Khác biệt cốt lõi:

| | Redefine | Retransform |
| --- | --- | --- |
| Bên gọi cung cấp bytes thay thế | Có | Không |
| Chạy lại chuỗi transformer | Có, trên bytes được redefine | Có, theo quy tắc retransformation |
| Transformer không hỗ trợ retransformation | được gọi trong redefine | không gọi lại; tái dùng đầu ra cũ |
| Phù hợp | đã có định nghĩa thay thế | áp dụng lại instrumentation hiện tại |

Quy tắc thực tế:

~~~text
"Tôi có class bytes mới cụ thể muốn cài"
→ redefine

"Tôi muốn chuỗi instrumentation tính lại class đã được nạp"
→ retransform
~~~

Cả hai đều cần class có thể sửa đổi và đều chịu các giới hạn cấu trúc. Không nên chọn chỉ vì tên một method nghe “mạnh hơn”.
