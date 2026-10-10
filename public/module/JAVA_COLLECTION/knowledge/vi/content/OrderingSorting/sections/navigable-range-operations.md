Sau khi người học đã hiểu `Set`, `Map` và thứ tự, các API của `NavigableSet`/`NavigableMap` mới có ý nghĩa đầy đủ.

```java
NavigableSet<Integer> ids = new TreeSet<>(List.of(10, 20, 30, 40));

System.out.println(ids.lower(20));   // 10: < 20
System.out.println(ids.floor(25));   // 20: <= 25
System.out.println(ids.ceiling(25)); // 30: >= 25
System.out.println(ids.higher(30));  // 40: > 30
```

Khung nhìn theo phạm vi cho phép nhìn một đoạn của tập đã sắp xếp mà không phải sao chép toàn bộ dữ liệu:

```java
NavigableSet<Integer> middle = ids.subSet(20, true, 40, false); // [20, 30]
NavigableSet<Integer> head = ids.headSet(30, true);              // <= 30
NavigableSet<Integer> tail = ids.tailSet(20, false);             // > 20
```

Các kết quả này là **các khung nhìn liên kết với dữ liệu gốc**. Thay đổi dữ liệu hợp lệ qua khung nhìn tác động lên nguồn, và nguồn thay đổi cũng có thể được khung nhìn quan sát theo quy ước.

Nhánh `Map` áp dụng cùng mô hình tư duy cho **khóa**:

```java
NavigableMap<Long, Order> byId = new TreeMap<>();
byId.put(10L, orderA);
byId.put(20L, orderB);
byId.put(30L, orderC);

Map.Entry<Long, Order> floor = byId.floorEntry(25L); // key 20
NavigableMap<Long, Order> firstTwo =
        byId.subMap(10L, true, 30L, false);           // keys 10, 20
```

`lower/floor/ceiling/higher` trả lời câu hỏi “phần tử/khóa gần nhất ở phía nào?”, còn `subSet/subMap/head*/tail*` tạo các khung nhìn theo phạm vi. Đây là lý do chọn cấu trúc Sorted/Navigable khi bài toán thực sự cần điều hướng theo thứ tự, không chỉ vì muốn kết quả “trông đã được sắp xếp”.
