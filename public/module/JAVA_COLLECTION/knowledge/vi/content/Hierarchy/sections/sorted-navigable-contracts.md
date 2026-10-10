Ở chương nhập môn chỉ cần nhớ vai trò của chúng:

- `SortedSet` / `SortedMap` thêm quy ước **luôn quan sát dữ liệu theo một thứ tự sắp xếp**;
- `NavigableSet` / `NavigableMap` mở rộng thêm khả năng tìm phần tử/khóa gần nhất và làm việc với các khoảng dữ liệu;
- `TreeSet` và `TreeMap` là hai cách triển khai quen thuộc của các quy ước này.

Các thao tác cụ thể như `lower`, `floor`, `ceiling`, `higher`, `subSet` và `subMap` chỉ có ý nghĩa sau khi đã hiểu `Set`, `Map` và thứ tự. Phần cơ chế chi tiết được dời tới chương về thứ tự/sắp xếp thay vì bắt người học học ngay ở bản đồ mở đầu.
