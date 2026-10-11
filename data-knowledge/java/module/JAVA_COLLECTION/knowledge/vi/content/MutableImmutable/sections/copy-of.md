`List.copyOf`, `Set.copyOf` và `Map.copyOf` nhận dữ liệu hiện có và tạo kết quả không cho phép sửa đại diện cho **nội dung tại thời điểm sao chép**.

```java
List<Order> source = new ArrayList<>();
source.add(new Order(1, 1, 20_000));

List<Order> snapshot = List.copyOf(source);

source.add(new Order(2, 2, 10_000));

System.out.println(source.size());   // 2
System.out.println(snapshot.size()); // 1
```

Các phương thức `copyOf` có thể tái sử dụng đối tượng khi đầu vào đã là collection không cho phép sửa phù hợp. Bên gọi không nên dựa vào định danh đối tượng; quy ước cần dựa vào nội dung và khả năng thay đổi.

Đây vẫn là **bản sao nông (shallow copy)**: tham chiếu tới các phần tử được sao chép, đối tượng bên trong không được sao chép sâu. Nếu một `Order` có thể thay đổi bị sửa thông qua tham chiếu khác, bản chụp vẫn quan sát trạng thái mới của chính đối tượng đó.

`copyOf` còn có các quy ước quan trọng về dữ liệu đầu vào:

- `List.copyOf` / `Set.copyOf` từ chối `null` phần tử;
- `Map.copyOf` từ chối `null` khóa và `null` giá trị;
- `List.copyOf` giữ thứ tự duyệt của collection nguồn trong list kết quả;
- `Set.copyOf` và `Map.copyOf` **không hứa bảo toàn thứ tự duyệt** của `LinkedHashSet`/`LinkedHashMap` nguồn.

Vì vậy `copyOf` là bản chụp về **nội dung**, nhưng không nên tự suy ra rằng mọi đặc tính quan sát như thứ tự chèn của một cách triển khai nguồn cũng được bản chụp theo.

Một điểm cần nhớ: `Set.copyOf(collection)` có thể nhận collection nguồn chứa các phần tử bằng nhau và chỉ giữ một đại diện; điều này khác với `Set.of(a, b, ...)`, nơi đối số trùng lặp bị từ chối.
