Chính sách `null` thuộc **quy ước của cách triển khai**, không thể suy ra chỉ từ `List`, `Set`, `Map` hay `Queue`. Một bảng nhớ nhanh:

| Cách triển khai | Chính sách `null` cơ bản |
| --- | --- |
| `ArrayList` | cho phép `null` phần tử |
| `LinkedList` | cho phép phần tử `null`, nhưng dùng `null` trong API kiểu Queue dễ gây nhập nhằng |
| `HashSet` / `LinkedHashSet` | cho phép một `null` phần tử |
| `TreeSet` | thứ tự tự nhiên thông thường không chấp nhận `null`; comparator tùy chỉnh có thể định nghĩa cách xử lý |
| `HashMap` / `LinkedHashMap` | cho phép một `null` khóa và nhiều `null` giá trị |
| `TreeMap` | thứ tự tự nhiên thông thường không chấp nhận `null` khóa; comparator tùy chỉnh có thể định nghĩa; `null` giá trị được phép |
| `ArrayDeque` | không cho `null` |
| `PriorityQueue` | không cho `null` |
| `List.of` / `Set.of` / `Map.of` và các họ `copyOf` tương ứng | không cho `null` phần tử/khóa/giá trị |

Không nên biến bảng này thành lý do thiết kế API bằng `null`. Đặc biệt với `Queue`, `poll/peek` dùng `null` để biểu diễn “không có phần tử”, nên phần tử `null` sẽ làm ngữ nghĩa khó đọc ngay cả khi một cách triển khai khác có thể cho phép nó.
