Tên lớp triển khai chỉ có ý nghĩa sau khi ta xác định các đặc tính dữ liệu cần giữ. Các chiều quan trọng gồm:

| Đặc tính | Câu hỏi cần trả lời |
| --- | --- |
| thứ tự duyệt | Khi duyệt, thứ tự phần tử có ý nghĩa và có được đảm bảo không? |
| Truy cập theo vị trí | Có cần truy cập theo chỉ số không? |
| Phần tử trùng | Hai giá trị “bằng nhau” có được cùng tồn tại không? |
| tra cứu theo khóa | Có cần tìm giá trị bằng một khóa riêng không? |
| Thứ tự sắp xếp | Dữ liệu có phải luôn nằm theo thứ tự tự nhiên hoặc `Comparator` không? |
| Chính sách `null` | Cách triển khai có chấp nhận `null` không? |
| Khả năng thay đổi | Cấu trúc có được thêm/xóa/thay đổi sau khi tạo không? |
| Chi phí thao tác | Kiểu sử dụng chủ yếu là đọc theo chỉ số, tra cứu, chèn/xóa đầu/cuối hay sắp thứ tự? |

Không nên suy ra chính sách `null` hoặc khả năng thay đổi chỉ từ interface. Ví dụ, `HashMap` cho phép một null khóa, trong khi `Map.of(...)` không cho phép khóa/giá trị là `null`. `ArrayList` có thể thay đổi kích thước, còn `List.of(...)` là không cho phép sửa.

Với cùng dữ liệu:

```java
List<Long> processingOrder = new ArrayList<>();     // thứ tự + trùng có thể hợp lệ
Set<Long> uniqueUsers = new HashSet<>();            // duy nhất
Map<Long, Order> orderById = new HashMap<>();       // tra cứu theo id
Deque<Order> pending = new ArrayDeque<>();           // xử lý ở hai đầu
```

Các chương tiếp theo sẽ lần lượt làm rõ từng quy ước. Khi học lớp triển khai, hãy luôn quay lại câu hỏi: **hành vi nào của bài toán buộc ta chọn cấu trúc này?**
