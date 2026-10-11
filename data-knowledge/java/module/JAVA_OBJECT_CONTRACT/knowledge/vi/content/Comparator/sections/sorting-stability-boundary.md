Phép sắp xếp ổn định giữ nguyên thứ tự xuất hiện tương đối của những phần tử mà comparator xem là bằng nhau.

Ví dụ đầu vào:

```text
[A(priority=1), B(priority=1), C(priority=2)]
```

Nếu chỉ sắp xếp theo `priority` và thuật toán/API bảo đảm tính ổn định, `A` vẫn đứng trước `B` sau khi sắp xếp vì comparator xem chúng ngang nhau.

### PHÂN BIỆT HAI QUY ƯỚC

```text
tính ổn định khi sắp xếp
→ thuộc tính của thuật toán/API sắp xếp

tính nhất quán của comparator
→ thuộc tính của hàm xác định thứ tự
```

Comparator tốt không tự bảo đảm phép sắp xếp ổn định. Ngược lại, một thuật toán sắp xếp ổn định cũng không sửa được comparator vi phạm tính bắc cầu.

Không nên giả định mọi API sắp xếp đều ổn định nếu tài liệu API không nói rõ.

Sau khi đã hiểu cả thứ tự tự nhiên lẫn thứ tự do đoạn mã sử dụng định nghĩa, chương cuối sẽ nối phần sắp xếp trở lại với định danh, phép bằng nhau, mã băm, biểu diễn văn bản và rủi ro do trạng thái thay đổi để tạo thành một mô hình quyết định thống nhất cho toàn mô-đun.
