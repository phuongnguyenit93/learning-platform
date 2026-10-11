`HashMap` là cách triển khai tổng quát khi cần tra cứu theo khóa nhanh và không cần thứ tự duyệt cụ thể.

Mô hình tư duy:

```text
khóa
 ↓ hashCode()
chọn vùng/bucket ứng viên
 ↓
equals() xác nhận khóa tương đương
 ↓
giá trị tương ứng
```

```java
Map<Long, Order> orderById = new HashMap<>();
for (Order order : orders) {
    orderById.put(order.id(), order);
}

Order found = orderById.get(1002L);
```

Với phân bố hash hợp lý, `put`, `get` và `remove` có chi phí kỳ vọng gần O(1). Đây là đặc tính kỳ vọng của bảng băm, không phải bảo đảm tuyệt đối cho trường hợp xấu nhất với mọi khóa và mọi trạng thái.

Giống `HashSet`, tính đúng đắn phụ thuộc vào khóa giữ `equals/hashCode` ổn định trong thời gian nó nằm trong Map. Nếu trường tham gia hash thay đổi sau `put`, tra cứu bằng khóa có thể không tìm được ánh xạ như mong đợi.

```java
record OrderKey(long id) {}

Map<OrderKey, Order> map = new HashMap<>();
map.put(new OrderKey(1001), order);
```

Record là ví dụ thuận tiện vì định danh logic của khóa dựa trên giá trị và record là bất biến. Không bắt buộc khóa phải là record; điều quan trọng là quy ước tính bằng nhau/hash phải phù hợp và ổn định.

`HashMap` không đảm bảo thứ tự duyệt. Nếu kết quả đang vô tình trùng với thứ tự chèn, đó vẫn không phải quy ước.
