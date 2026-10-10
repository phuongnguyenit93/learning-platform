`TreeMap` duy trì ánh xạ theo **thứ tự sắp xếp của khóa**.

```java
Map<Long, Order> orders = new TreeMap<>();
orders.put(30L, order30);
orders.put(10L, order10);
orders.put(20L, order20);

System.out.println(orders.keySet()); // [10, 20, 30]
```

Khóa được sắp theo thứ tự tự nhiên hoặc theo `Comparator` truyền vào constructor.

```java
record UserKey(long id, String region) {}

Map<UserKey, User> users = new TreeMap<>(
        Comparator.comparing(UserKey::region)
                  .thenComparingLong(UserKey::id)
);
```

Giống `TreeSet`, kết quả so sánh bằng 0 quyết định rằng hai khóa là cùng một vị trí logic đối với `TreeMap`. Nếu comparator bỏ qua trường quan trọng, `put` khóa thứ hai có thể thay thế giá trị của khóa thứ nhất.

Vì vậy với Map có sắp xếp, thứ tự nên **nhất quán với `equals`**. Một `TreeMap` mà phép so sánh xem hai khóa không bằng nhau theo `equals` là tương đương vẫn có hành vi xác định, nhưng nó không còn tuân theo sạch quy ước chung về tính bằng nhau của `Map`, vì quan hệ tương đương giữa các khóa bên trong cây đang được quyết định bởi phép so sánh thay vì `equals`.

`TreeMap` thường có O(log n) cho `get`, `put` và `remove`, đổi lại có các thao tác điều hướng như `firstEntry`, `lastEntry`, `lowerEntry`, `floorEntry`, `ceilingEntry` và `higherEntry`.

Với thứ tự tự nhiên thông thường, `TreeMap` không cho null khóa vì không thể so sánh nó theo quy ước đó. Null giá trị vẫn có thể được lưu. Comparator tùy chỉnh có thể định nghĩa xử lý null khóa, nhưng API nên làm điều đó có chủ đích.

Trong Java 21, hệ phân cấp Map có sắp xếp cũng tham gia `SequencedMap`, nên ngữ nghĩa đầu/cuối/đảo thứ tự có interface chung. Lý do chọn `TreeMap` vẫn là nhu cầu **tra cứu/điều hướng theo khóa có sắp xếp**.
