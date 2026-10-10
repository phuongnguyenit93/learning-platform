Một số mẫu có thể tạo lượng quay lui (backtracking) rất lớn trên đầu vào xấu, đặc biệt khi lượng từ lồng nhau hoặc các nhánh lựa chọn mơ hồ kết hợp không cẩn thận.

Ví dụ dạng rủi ro:

```regex
(a+)+$
```

Đầu vào dài gần khớp nhưng thất bại ở cuối có thể buộc bộ máy Regex thử rất nhiều cách phân chia trước khi kết luận.

Với regex nhận đầu vào không tin cậy:

- giữ mẫu đơn giản;
- giới hạn đầu vào khi phù hợp;
- tránh cấu trúc dễ gây quay lui bùng nổ (catastrophic backtracking);
- đo đạc/kiểm thử trường hợp xấu nhất thay vì chỉ kiểm thử đầu vào khớp đẹp.

Ngoài ra:

- tái sử dụng `Pattern` đã biên dịch khi cùng một mẫu chạy lặp lại nhiều;
- tránh dùng Regex để phân tích ngữ pháp phức tạp khi bộ phân tích cú pháp hoặc máy trạng thái rõ ràng hơn;
- đặt giới hạn kích thước/thời gian ở tầng ứng dụng nếu Regex xử lý đầu vào lớn không tin cậy;
- rà soát lượng từ lồng nhau và các nhánh lựa chọn chồng lấn.

Regex rất mạnh nhưng không phải bộ phân tích cú pháp phù hợp cho mọi ngữ pháp phức tạp.

Chương cuối của mô-đun nói về **cách viết String nhiều dòng trong mã nguồn** và tổng hợp toàn bộ mô hình xử lý String, không phải một kiểu String mới.
