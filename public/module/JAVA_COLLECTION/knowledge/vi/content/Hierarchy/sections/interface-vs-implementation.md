Trong mã ứng dụng, kiểu biến nên mô tả **khả năng mà đoạn mã thật sự cần**. Lớp cụ thể chỉ nên xuất hiện khi cần chọn cách lưu trữ.

```java
List<Order> orders = new ArrayList<>();
orders.add(new Order(1001, 7, 120));
orders.add(new Order(1002, 7, 80));
```

Ở đây:

- `List<Order>` là quy ước: có thứ tự, có vị trí, cho phép trùng.
- `ArrayList<Order>` là lớp triển khai: dùng mảng động để thực hiện quy ước đó.

Một phương thức chỉ cần duyệt các đơn hàng có thể nhận kiểu rộng hơn:

```java
int totalRevenue(Collection<Order> orders) {
    int total = 0;
    for (Order order : orders) {
        total += order.totalCents();
    }
    return total;
}
```

Phương thức này không cần chỉ số, không cần biết dữ liệu đến từ `ArrayList` hay `HashSet`, nên `Collection<Order>` diễn đạt đúng phụ thuộc của nó.

Ngược lại, nếu phương thức cần `get(0)` thì `List<Order>` mới là quy ước phù hợp. Nguyên tắc “program to interface” không có nghĩa là luôn chọn interface rộng nhất; nó có nghĩa là chọn **interface nhỏ nhất vẫn biểu đạt đủ hành vi cần thiết**.

Giữ ranh giới này giúp thay đổi lớp triển khai dễ hơn:

```java
List<Order> orders = new ArrayList<>();
// Có thể đổi sang lớp triển khai List khác nếu kiểu sử dụng thay đổi,
// miễn là mã phía sử dụng chỉ phụ thuộc vào quy ước List.
```

Generics quyết định kiểu phần tử như `List<Order>` hay `Map<Long, Order>`; module Collection tập trung vào quy ước lưu trữ và thao tác. Các quy tắc về phương sai (variance)/PECS chi tiết thuộc module Generics.
