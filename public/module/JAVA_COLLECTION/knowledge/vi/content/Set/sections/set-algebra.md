Vì `Set` mô hình hóa một tập phần tử duy nhất, các thao tác hàng loạt của `Collection` có thể được đọc theo đúng tư duy tập hợp:

```java
Set<Long> first = new HashSet<>(Set.of(1L, 2L, 3L));
Set<Long> second = Set.of(3L, 4L);
```

### Hợp (union)

```java
Set<Long> union = new HashSet<>(first);
union.addAll(second); // [1, 2, 3, 4]
```

### Giao (intersection)

```java
Set<Long> intersection = new HashSet<>(first);
intersection.retainAll(second); // [3]
```

### Hiệu (difference)

```java
Set<Long> difference = new HashSet<>(first);
difference.removeAll(second); // [1, 2]
```

Điểm quan trọng là các thao tác này **thay đổi Set nhận lời gọi** nếu Set đó có thể thay đổi. Khi muốn giữ dữ liệu gốc, hãy tạo một bản sao trước rồi thao tác trên bản sao như các ví dụ trên.
