`LinkedList` dùng các node liên kết hai chiều. Mỗi node giữ phần tử và liên kết tới node trước/sau.

```text
null ← [A] ⇄ [B] ⇄ [C] → null
```

Mô hình này làm cho thêm/xóa ở đầu hoặc cuối rất tự nhiên:

```java
Deque<Order> pending = new LinkedList<>();
pending.addFirst(urgentOrder);
pending.addLast(normalOrder);
```

Nếu đã có tham chiếu tới đúng nút nội bộ, thao tác nối/cắt liên kết là hằng số. Nhưng API `List` không đưa nút đó cho bên gọi. Để thực hiện `get(5000)` hoặc `add(5000, value)`, `LinkedList` phải đi qua các nút từ một đầu tới vị trí cần tìm, nên bước định vị là O(n).

```java
Order order = linkedOrders.get(5000); // phải duyệt tới vị trí
```

Chi phí bộ nhớ cũng khác: mỗi phần tử cần một node với các liên kết, trong khi `ArrayList` chủ yếu giữ các tham chiếu trong mảng.

Vì vậy “`LinkedList` chèn/xóa nhanh hơn `ArrayList`” là kết luận quá rộng. Nó có lợi khi thao tác ở hai đầu hoặc khi thuật toán đã có vị trí iterator phù hợp; nó không tự động thắng với chèn/xóa theo chỉ số vì vẫn phải tìm nút.

Trong Java hiện đại, nếu nhu cầu thật sự là queue/stack hai đầu, `ArrayDeque` thường là lựa chọn rõ ràng hơn. `LinkedList` vẫn hữu ích khi cần đúng hợp đồng `List` cùng với thao tác hai đầu, nhưng nên chọn dựa trên kiểu sử dụng cụ thể.
