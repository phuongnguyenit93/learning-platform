Vì `Map` không kế thừa `Collection`, nó có tập thao tác cơ bản riêng. Người học mới nên nắm nhóm thao tác này trước khi đi tới `compute`/`merge`:

| Ý định | thao tác |
| --- | --- |
| số ánh xạ | `size()` |
| map có rỗng không | `isEmpty()` |
| đọc giá trị theo khóa | `get(key)` |
| thêm/thay ánh xạ | `put(key, value)` |
| có khóa hay không | `containsKey(key)` |
| có giá trị hay không | `containsValue(value)` |
| xóa ánh xạ theo khóa | `remove(key)` |
| xóa toàn bộ ánh xạ | `clear()` |
| sao chép toàn bộ ánh xạ từ Map khác | `putAll(otherMap)` |

```java
Map<Long, Order> orders = new HashMap<>();
orders.put(1001L, orderA);
orders.put(1002L, orderB);

boolean has1001 = orders.containsKey(1001L);
boolean containsOrderB = orders.containsValue(orderB);
Order found = orders.get(1002L);

orders.remove(1001L);
```

`containsKey` thường quan trọng hơn `containsValue`: tra cứu theo khóa là mô hình trừu tượng chính của `Map`, còn tìm theo giá trị thường phải kiểm tra nhiều ánh xạ và không phải lý do chính để chọn Map.
