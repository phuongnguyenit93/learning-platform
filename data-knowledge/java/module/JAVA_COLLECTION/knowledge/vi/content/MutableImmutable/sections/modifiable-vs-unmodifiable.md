Một collection **có thể sửa** cho phép các thao tác thay đổi phù hợp với quy ước của nó, chẳng hạn `add`, `remove` hoặc `clear`. Một **khung nhìn không cho phép sửa** chặn các thao tác thay đổi đi qua khung nhìn, thường bằng `UnsupportedOperationException`, nhưng collection nguồn đứng phía sau vẫn có thể thay đổi.

```java
List<Order> source = new ArrayList<>();
source.add(new Order(1, 1, 20_000));

List<Order> view = Collections.unmodifiableList(source);

// view.add(...) -> UnsupportedOperationException
source.add(new Order(2, 2, 10_000));

System.out.println(view.size()); // 2: view nhìn thấy thay đổi của source
```

Vì vậy “không cho phép sửa” không đồng nghĩa với “không bao giờ thay đổi”. Nó chỉ nói rằng tham chiếu/khung nhìn này không cung cấp đường sửa cấu trúc.

Với Java 21, cùng ý tưởng được áp dụng cho các sequenced collection qua `Collections.unmodifiableSequencedCollection`, `unmodifiableSequencedSet` và `unmodifiableSequencedMap`. Điều này giữ quy ước về thứ tự duyệt/đầu-cuối trong khi chặn thay đổi qua lớp bọc.
