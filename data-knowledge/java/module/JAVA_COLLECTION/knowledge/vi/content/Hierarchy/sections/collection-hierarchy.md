Điểm bắt đầu quan trọng nhất không phải là thuộc tên lớp, mà là biết **câu hỏi nào dẫn tới interface nào**.

```text
Iterable<E>
    ↓
Collection<E>
    ├── List<E>       → giữ thứ tự, truy cập theo vị trí, cho phép phần tử trùng
    ├── Set<E>        → đảm bảo tính duy nhất
    │     └── SortedSet<E>       → quy ước Set có thứ tự sắp xếp
    │            └── NavigableSet<E> → tìm phần tử lân cận/điều hướng theo phạm vi
    └── Queue<E>      → ưu tiên thao tác đưa vào / lấy ra để xử lý
          └── Deque<E> → thao tác ở cả hai đầu

Map<K, V>             → ánh xạ khóa → giá trị, nằm ở nhánh riêng
    └── SortedMap<K, V>       → quy ước Map có khóa được sắp xếp
           └── NavigableMap<K, V> → tìm khóa lân cận/điều hướng theo phạm vi
```

`Collection<E>` kế thừa `Iterable<E>`, nên các collection có một giao thức duyệt chung. `List`, `Set` và `Queue` bổ sung các quy ước chuyên biệt hơn. `SortedSet` rồi `NavigableSet` lần lượt bổ sung thứ tự sắp xếp và các thao tác tìm phần tử lân cận. Ở nhánh `Map`, `SortedMap` và `NavigableMap` làm điều tương tự cho khóa. `Deque` là một dạng `Queue` có hai đầu.

Sau khi nắm hệ phân cấp cơ bản, Java 21 bổ sung các interface **Sequenced** để những cấu trúc có thứ tự duyệt xác định dùng chung nhóm thao tác đầu/cuối/`reversed()`:

```text
SequencedCollection<E>
├── List<E>
├── Deque<E>
└── SequencedSet<E>

SequencedMap<K, V>    → phiên bản có thứ tự đầu/cuối ở nhánh Map
```

Quan hệ này có vài “cầu nối” cần đọc chính xác: `List` kế thừa `SequencedCollection`; `Deque` đồng thời là `Queue` và `SequencedCollection`; còn `SequencedSet` đồng thời là `Set` và `SequencedCollection`. `SortedSet` cũng là một `SequencedSet`; `SortedMap` cũng là một `SequencedMap`. Các interface mới giúp API diễn đạt trực tiếp các thao tác như `getFirst()`, `getLast()` hoặc `reversed()`, nhưng không thay thế các quy ước Sorted/Navigable nền tảng.
