`Comparator<T>` đặt quy tắc sắp xếp **bên ngoài** kiểu dữ liệu. Đây là lựa chọn phù hợp khi cùng một đối tượng cần nhiều cách sắp xếp: theo tổng tiền, theo người dùng, theo thời gian, theo độ ưu tiên...

```java
Comparator<Order> byTotalDescendingThenId =
        Comparator.comparingInt(Order::totalCents)
                .reversed()
                .thenComparingLong(Order::id);

orders.sort(byTotalDescendingThenId);
```

Việc thêm tiêu chí phân xử khi bằng nhau như `thenComparingLong(Order::id)` giúp tạo thứ tự tổng thể rõ ràng khi tiêu chí chính bằng nhau. Cùng một `Comparator` có thể được truyền cho `List.sort`, `TreeSet`, `TreeMap` hoặc `PriorityQueue`, nhưng ý nghĩa của kết quả phụ thuộc vào cấu trúc:

- Với `List.sort`, comparator quyết định thứ tự sau thao tác sắp xếp.
- Với `TreeSet`, kết quả so sánh bằng `0` còn xác định hai phần tử có cùng vị trí logic trong set.
- Với `TreeMap`, comparator xác định thứ tự và tính duy nhất của khóa theo quan hệ so sánh.
- Với `PriorityQueue`, comparator xác định phần tử nào có ưu tiên ở đầu Queue; iterator của Queue không vì thế mà trả toàn bộ phần tử theo thứ tự đã sắp xếp.

Do đó comparator không chỉ là “hàm để sắp xếp”. Khi đưa nó vào collection có sắp xếp, nó trở thành một phần của quy ước nhận dạng và tổ chức dữ liệu của collection.
