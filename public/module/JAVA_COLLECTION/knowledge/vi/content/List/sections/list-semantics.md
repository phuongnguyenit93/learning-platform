`List<E>` là collection có thứ tự duyệt xác định và hỗ trợ truy cập theo vị trí bằng chỉ số bắt đầu từ 0.

```java
List<Order> orders = new ArrayList<>();
orders.add(new Order(1001, 7, 120));
orders.add(new Order(1002, 8, 90));
orders.add(new Order(1003, 7, 120));

Order first = orders.get(0);
Order second = orders.get(1);
```

Thứ tự trong `List` là một phần của quy ước. Nếu thêm phần tử vào cuối, nó trở thành phần tử sau cùng; nếu chèn ở chỉ số 1, các phần tử phía sau dịch vị trí.

`List` cũng cho phép phần tử trùng theo `equals`:

```java
List<String> statuses = new ArrayList<>();
statuses.add("NEW");
statuses.add("NEW");

System.out.println(statuses.size()); // 2
```

Điều này khác `Set`, nơi tính duy nhất là quy ước chính. Nếu yêu cầu nghiệp vụ nói “mọi lần xuất hiện đều có ý nghĩa”, `List` thường là điểm bắt đầu phù hợp.

Các thao tác đặc trưng:

```java
orders.add(order);          // thêm cuối
orders.add(1, order);       // chèn theo vị trí
orders.get(1);              // đọc theo vị trí
orders.set(1, replacement); // thay phần tử tại vị trí
orders.remove(1);           // xóa theo vị trí
```

Từ Java 21, `List` là một `SequencedCollection`. Vì vậy các list phù hợp có API thống nhất để làm việc với hai đầu như `getFirst()`, `getLast()`, `addFirst()`, `addLast()` và `reversed()`. Khả năng sửa vẫn phụ thuộc collection cụ thể; một list không cho phép sửa có thể ném `UnsupportedOperationException` cho thao tác thay đổi.
