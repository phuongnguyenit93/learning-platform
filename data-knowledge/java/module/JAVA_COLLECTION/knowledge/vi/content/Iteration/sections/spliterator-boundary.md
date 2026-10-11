`Spliterator<E>` có thể xem là mô hình duyệt mở rộng từ ý tưởng iterator. Nó hỗ trợ hai khả năng:

1. duyệt phần tử;
2. thử chia nguồn thành các phần để xử lý độc lập.

```java
Spliterator<Order> spliterator = orders.spliterator();

spliterator.tryAdvance(order ->
        System.out.println(order.id())
);
```

`tryAdvance` xử lý một phần tử nếu còn dữ liệu và trả boolean cho biết có thành công hay không. `forEachRemaining` xử lý phần còn lại.

Khả năng đặc trưng là `trySplit()`:

```java
Spliterator<Order> left = orders.spliterator();
Spliterator<Order> right = left.trySplit();
```

Cách triển khai có thể trả một spliterator khác đại diện cho một phần dữ liệu, hoặc trả `null` nếu không thể/không muốn chia tiếp. Không nên giả định mọi nguồn chia đều hoặc chia hiệu quả như nhau.

Spliterator còn công bố **các đặc tính (characteristics)** giúp bên sử dụng hiểu nguồn, ví dụ:

- `ORDERED` — có thứ tự duyệt;
- `DISTINCT` — phần tử là duy nhất theo quy ước nguồn;
- `SORTED` — nguồn có thứ tự sắp xếp;
- `SIZED` — biết chính xác kích thước;
- `SUBSIZED` — các phần sau khi tách cũng có kích thước chính xác theo quy ước.

```java
boolean ordered = spliterator.hasCharacteristics(Spliterator.ORDERED);
long estimate = spliterator.estimateSize();
```

Ranh giới quan trọng của chương này là mối liên hệ với Stream:

```text
Collection
    ↓ spliterator()
Spliterator
    ↓ cung cấp khả năng duyệt + chia nhỏ + đặc tính nguồn
Stream pipeline
```

`Collection.stream()` và `parallelStream()` dùng spliterator làm nguồn duyệt. `Spliterator` tạo nền cho việc chia dữ liệu, nhưng **không tự biến quá trình duyệt thành song song** và không tự giải quyết an toàn luồng. Cách pipeline Stream thực thi, tính song song và xử lý đồng thời là các chủ đề riêng.

Với module Collection, điều cần nhớ là: `Iterator` tối ưu cho việc duyệt tuần tự từng phần tử; `Spliterator` mở rộng giao thức đó bằng thông tin về nguồn và khả năng chia quá trình duyệt cho các thành phần tiêu thụ cấp cao hơn như Stream.
