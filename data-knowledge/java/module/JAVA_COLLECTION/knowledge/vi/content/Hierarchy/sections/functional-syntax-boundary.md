Một số API Collection nhận **hành vi** do bên gọi cung cấp, nên các chương sau sẽ xuất hiện cú pháp như:

```java
orders.removeIf(order -> order.totalCents() == 0);
Comparator.comparingLong(Order::id);
selected.toArray(Order[]::new);
```

Trong module Collection, chỉ cần đọc chúng theo ý nghĩa:

```text
order -> ...
→ một hàm nhận order rồi trả kết quả

Order::id
→ tham chiếu tới hành vi lấy id từ Order

Order[]::new
→ tham chiếu tới cách tạo Order[] với kích thước được yêu cầu
```

Lambda, functional interface và tham chiếu phương thức có lộ trình học riêng trong module Lập trình hàm. Ở đây chúng chỉ là **cú pháp để truyền hành vi vào API Collection**, không phải khái niệm nền của Collection.
