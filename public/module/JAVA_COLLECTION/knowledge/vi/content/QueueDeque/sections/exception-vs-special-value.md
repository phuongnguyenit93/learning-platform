`Queue` có hai nhóm phương thức cho cùng loại thao tác. Khác biệt nằm ở cách báo “không thể thực hiện”:

| Ý định | Ném ngoại lệ khi thất bại | Trả giá trị đặc biệt |
| --- | --- | --- |
| thêm | `add(e)` | `offer(e)` |
| lấy và xóa phần tử đầu | `remove()` | `poll()` |
| đọc phần tử đầu, không xóa | `element()` | `peek()` |

Với queue rỗng:

```java
Queue<Order> queue = new ArrayDeque<>();

Order a = queue.poll(); // null
Order b = queue.peek(); // null

// queue.remove();  // NoSuchElementException
// queue.element(); // NoSuchElementException
```

Với Queue có giới hạn dung lượng, `add(e)` có thể ném `IllegalStateException` nếu hiện tại không thể thêm phần tử, trong khi `offer(e)` trả `false`. Các cách triển khai như `ArrayDeque` thường không có kiểu thất bại do giới hạn dung lượng này trong sử dụng thông thường, nhưng cặp API vẫn giữ cùng quy ước chung.

Chọn cặp nào phụ thuộc vào ý nghĩa của trạng thái rỗng/đầy:

- nếu “không có phần tử” là một trạng thái bình thường, `poll/peek` thường tiện hơn;
- nếu nó biểu thị vi phạm bất biến và bên gọi muốn lỗi rõ ngay, `remove/element` có thể phù hợp hơn;
- khi thêm vào Queue có thể hợp lệ nhưng tạm thời bị từ chối, `offer` diễn đạt thất bại bằng giá trị trả về.

`Deque` có các cặp tương tự cho từng đầu, ví dụ `addFirst/offerFirst`, `removeFirst/pollFirst` và `getFirst/peekFirst`.
