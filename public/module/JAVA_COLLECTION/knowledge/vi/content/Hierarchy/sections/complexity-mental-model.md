Collection thường được so sánh bằng **độ phức tạp thao tác**. Người học chưa cần biết toàn bộ thuật toán Big-O; chỉ cần đọc được các ký hiệu xuất hiện trong module:

| Ký hiệu | Mô hình tư duy | Khi `n` tăng lớn |
| --- | --- | --- |
| `O(1)` | làm một lượng công việc gần như không phụ thuộc số phần tử | tăng rất ít |
| `O(log n)` | mỗi bước loại bỏ được một phần lớn vùng tìm kiếm | tăng chậm |
| `O(n)` | có thể phải đi qua số phần tử tỉ lệ với kích thước collection | tăng gần tuyến tính |

Ví dụ với 1.000.000 phần tử, `ArrayList.get(index)` vẫn có thể nhảy thẳng tới vị trí cần đọc (`O(1)`), trong khi tìm một giá trị bằng cách quét danh sách có thể phải kiểm tra rất nhiều phần tử (`O(n)`). Một cây cân bằng như `TreeMap` thường tìm theo đường đi có chiều cao `O(log n)`.

Hai cách diễn đạt bổ sung cũng xuất hiện nhiều:

- **amortized O(1)**: phần lớn thao tác rất rẻ nhưng đôi lúc có một lần đắt hơn, ví dụ `ArrayList` phải tăng dung lượng; tính trên một chuỗi dài thao tác thì chi phí trung bình vẫn gần hằng số;
- **kỳ vọng O(1) (expected O(1))**: hiệu năng kỳ vọng gần hằng số khi điều kiện như phân bố hash hợp lý; đây không phải bảo đảm tuyệt đối cho trường hợp xấu nhất.

Big-O chỉ nói **xu hướng tăng chi phí**, không nói một thao tác chắc chắn nhanh hơn thao tác khác trong mọi trường hợp. Cách bố trí bộ nhớ, tính cục bộ của bộ nhớ đệm, kích thước dữ liệu và kiểu sử dụng thực tế vẫn quan trọng.
