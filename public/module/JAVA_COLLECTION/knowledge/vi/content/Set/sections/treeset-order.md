`TreeSet` giải quyết một bài toán khác: nó giữ phần tử theo **thứ tự sắp xếp** thay vì thứ tự chèn.

```java
Set<Long> orderIds = new TreeSet<>();
orderIds.add(30L);
orderIds.add(10L);
orderIds.add(20L);

System.out.println(orderIds); // [10, 20, 30]
```

Thứ tự đến từ:

- thứ tự tự nhiên của phần tử nếu không truyền comparator;
- hoặc một `Comparator<? super E>` được cung cấp khi tạo set.

```java
record User(long id, String name) {}

Set<User> usersByName = new TreeSet<>(
        Comparator.comparing(User::name)
                  .thenComparingLong(User::id)
);
```

Với `TreeSet`, kết quả so sánh bằng 0 quyết định rằng hai phần tử chiếm cùng một vị trí logic trong set:

```java
Comparator<User> byNameOnly = Comparator.comparing(User::name);
Set<User> users = new TreeSet<>(byNameOnly);

users.add(new User(1, "An"));
users.add(new User(2, "An"));

System.out.println(users.size()); // 1
```

Hai `User` trên có id khác nhau nhưng comparator chỉ nhìn `name`, nên `compare(a, b) == 0` và `TreeSet` xem chúng là cùng vị trí cho mục đích lưu trữ. Nếu thứ tự không nhất quán với `equals`, hành vi của `TreeSet` vẫn xác định nhưng Set có sắp xếp không còn thực hiện sạch quy ước tính bằng nhau chung của `Set`. Trong thực tế, comparator dùng cho `TreeSet` nên nhất quán với khái niệm tính bằng nhau mà API muốn công bố, hoặc cần chọn cấu trúc khác.

`TreeSet` thường có O(log n) cho `add`, `contains` và `remove`. Đổi lại, nó cung cấp các thao tác sắp xếp/điều hướng như `first`, `last`, `lower`, `higher`, `floor` và `ceiling`.

Từ Java 21, hệ phân cấp Set có sắp xếp cũng có ngữ nghĩa Sequenced, nên đầu/cuối và khung nhìn đảo có thể được diễn đạt thống nhất. Dù API hiện đại hơn, lý do chọn cấu trúc này vẫn là **thứ tự sắp xếp**, không phải thứ tự chèn.
