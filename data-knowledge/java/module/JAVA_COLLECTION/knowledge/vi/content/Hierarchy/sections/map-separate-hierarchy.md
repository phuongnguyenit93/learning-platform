`Map<K, V>` không phải là `Collection<V>`. Một collection mô hình hóa một nhóm **phần tử**; một map mô hình hóa một nhóm **ánh xạ từ khóa sang giá trị**. Đơn vị ý nghĩa của hai cấu trúc khác nhau.

Ví dụ:

```java
List<Order> orders = List.of(
        new Order(1001, 7, 120),
        new Order(1002, 7, 80)
);

Map<Long, Order> orderById = Map.of(
        1001L, orders.get(0),
        1002L, orders.get(1)
);
```

Với `List<Order>`, câu hỏi tự nhiên là “phần tử ở vị trí 0 là gì?” hoặc “hãy duyệt mọi đơn hàng”. Với `Map<Long, Order>`, câu hỏi tự nhiên là “đơn hàng có khóa 1002 là gì?”. Nếu `Map` kế thừa `Collection`, các API như `add(E)` sẽ không thể hiện được việc một ánh xạ cần cả khóa lẫn giá trị.

Map vẫn cung cấp các **khung nhìn dạng Collection** để nối hai mô hình:

```java
Set<Long> ids = orderById.keySet();
Collection<Order> values = orderById.values();
Set<Map.Entry<Long, Order>> entries = orderById.entrySet();
```

Các khung nhìn này rất hữu ích khi cần duyệt khóa, giá trị hoặc entry, nhưng `Map` vẫn giữ quy ước riêng về tính duy nhất của khóa và cách tra cứu.

Từ Java 21, `SequencedMap` bổ sung khái niệm entry đầu/cuối và khung nhìn đảo thứ tự cho các map có thứ tự duyệt xác định. Nó vẫn thuộc nhánh `Map`, không chuyển `Map` thành `Collection`.
