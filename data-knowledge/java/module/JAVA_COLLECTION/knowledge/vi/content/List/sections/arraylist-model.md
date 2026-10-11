`ArrayList` nên được hình dung như một **mảng có khả năng tăng dung lượng**. Bên trong có vùng lưu trữ liên tiếp theo chỉ số và một kích thước logic cho biết có bao nhiêu phần tử đang được sử dụng.

Khi còn chỗ trống, thêm cuối rất rẻ:

```text
capacity = 8
size     = 5

[A][B][C][D][E][ ][ ][ ]
                  ↑
             add ở đây
```

Khi vùng lưu trữ không còn đủ, cách triển khai cấp một mảng lớn hơn và sao chép các phần tử sang đó. Vì việc tăng dung lượng chỉ xảy ra thỉnh thoảng, `add(E)` ở cuối có chi phí **amortized O(1)**, dù một lần tăng dung lượng riêng lẻ tốn O(n).

Truy cập theo chỉ số cũng rất phù hợp với mô hình mảng:

```java
Order order = orders.get(500);
```

`get(index)` có O(1) vì vị trí có thể được tính trực tiếp. Ngược lại, chèn hoặc xóa ở giữa thường cần dịch các phần tử phía sau:

```text
before: [A][B][C][D]
insert X at index 1
after : [A][X][B][C][D]
              └────────→ các phần tử bị dịch
```

Vì vậy:

| Thao tác điển hình | `ArrayList` |
| --- | --- |
| `get(index)` | O(1) |
| `set(index, value)` | O(1) |
| thêm cuối | amortized O(1) |
| chèn/xóa giữa | O(n) do dịch phần tử |
| tìm theo giá trị | O(n) nếu phải quét tuyến tính |

Big-O mô tả xu hướng chi phí, không phải kết quả đo hiệu năng tuyệt đối. Tính cục bộ của bộ nhớ đệm và chi phí phụ của đối tượng còn ảnh hưởng hiệu năng thực tế. Với kiểu sử dụng chủ yếu đọc theo chỉ số và thêm cuối, `ArrayList` thường là lựa chọn mặc định tốt cho `List`.

`ArrayList` không tự đồng bộ hóa cho truy cập từ nhiều luồng. Chi tiết xử lý đồng thời thuộc module riêng; ở đây chỉ cần nhớ rằng lựa chọn collection không tự động giải quyết quyền sở hữu và đồng bộ hóa dữ liệu.
