Một phép sắp xếp là **ổn định (stable)** nếu các phần tử mà comparator xem là bằng nhau giữ nguyên thứ tự tương đối ban đầu của chúng. `List.sort` và `Collections.sort` trong Java được quy định là ổn định.

```java
List<Order> orders = new ArrayList<>(List.of(
        new Order(3, 2, 10_000),
        new Order(1, 1, 20_000),
        new Order(2, 3, 10_000)
));

orders.sort(Comparator.comparingInt(Order::totalCents));

// Hai order 3 và 2 cùng totalCents = 10_000.
// Sau khi sắp xếp, order 3 vẫn đứng trước order 2 vì phép sắp xếp ổn định.
```

Sắp xếp ổn định hữu ích khi dữ liệu đã có một thứ tự phụ từ trước. Ví dụ, ta có thể sắp theo thời gian trước, sau đó sắp xếp ổn định theo trạng thái để giữ thứ tự thời gian bên trong từng nhóm trạng thái.

Cần phân biệt sắp xếp ổn định với collection có sắp xếp. `TreeSet` không “giữ cả hai phần tử bằng nhau rồi nhớ thứ tự cũ”; nếu comparator trả `0` cho hai phần tử, Set coi chúng là tương đương theo thứ tự và chỉ giữ một đại diện. Nếu nghiệp vụ cần giữ cả hai, comparator của Set phải có tiêu chí phân xử phù hợp hoặc cần chọn cấu trúc khác.
