Quy ước chung của `Set<E>` là **không chứa hai phần tử bằng nhau theo quy tắc tính bằng nhau của `Set`**. Với các cách triển khai thông thường như `HashSet`, `equals` quyết định tính bằng nhau còn `hashCode` giúp tìm vùng ứng viên hiệu quả. Đặc điểm riêng của Set có sắp xếp như `TreeSet` sẽ được giải thích ở đúng phần của nó sau khi người học đã nắm ngữ nghĩa cơ bản của `Set`.

Ví dụ, nếu chỉ cần biết những người dùng nào đã có đơn hàng:

```java
Set<Long> userIds = new HashSet<>();
userIds.add(7L);
userIds.add(8L);
userIds.add(7L);

System.out.println(userIds.size()); // 2
```

Lần `add(7L)` thứ hai không tạo thêm một phần tử. `Set.add` trả về `false` khi set không thay đổi vì phần tử tương đương đã tồn tại:

```java
boolean first = userIds.add(9L);  // true
boolean again = userIds.add(9L);  // false
```

`Set` không hứa truy cập theo chỉ số. Nếu mã nguồn cần “phần tử thứ ba”, đó thường là dấu hiệu cần `List` hoặc một mô hình trừu tượng có thứ tự duyệt rõ hơn.

Chính sách `null` không giống nhau giữa các cách triển khai. `HashSet` và `LinkedHashSet` cho phép một phần tử `null`; `TreeSet` dùng thứ tự tự nhiên thông thường sẽ không chấp nhận `null`. API nên dựa vào quy ước/tài liệu của cách triển khai cụ thể thay vì giả định mọi `Set` giống nhau.

Từ Java 21, `SequencedSet` kết hợp tính duy nhất của `Set` với thứ tự duyệt có đầu/cuối. `LinkedHashSet` và các interface Set có sắp xếp hiện đại tham gia mô hình trừu tượng này, nên mã nguồn có thể nói rõ khi cả tính duy nhất lẫn thứ tự đều là một phần của quy ước.
