`LinkedHashSet` thêm một thứ tự duyệt xác định vào tính duy nhất của HashSet. Với thao tác `add` thông thường, thứ tự mặc định là thứ tự phần tử được chèn lần đầu.

```java
Set<Long> userIds = new LinkedHashSet<>();
userIds.add(7L);
userIds.add(2L);
userIds.add(9L);
userIds.add(2L);

System.out.println(userIds); // [7, 2, 9]
```

Thêm lại `2L` không tạo phần tử mới và không tự động chuyển nó về cuối theo ngữ nghĩa của `add` thông thường.

Đây là lựa chọn tốt khi logic nghiệp vụ cần cả hai điều:

```text
không trùng
    +
giữ thứ tự duyệt có thể dự đoán
```

Ví dụ, ta có thể lấy danh sách người dùng duy nhất theo thứ tự họ xuất hiện lần đầu trong luồng dữ liệu đơn hàng:

```java
Set<Long> usersInFirstSeenOrder = new LinkedHashSet<>();
for (Order order : orders) {
    usersInFirstSeenOrder.add(order.userId());
}
```

Trong Java 21, `LinkedHashSet` triển khai `SequencedSet`. Ngoài thứ tự duyệt vốn có, nó có API đầu/cuối, khả năng định vị rõ ràng như `addFirst`/`addLast` và khung nhìn `reversed()`. Điều này làm rõ hơn rằng thứ tự của cấu trúc là quy ước quan sát được, không chỉ là một chi tiết in ra đẹp mắt.

Đổi từ `HashSet` sang `LinkedHashSet` có thêm chi phí lưu thông tin liên kết thứ tự. Vì vậy chỉ trả chi phí đó khi thứ tự thật sự là yêu cầu có giá trị.
