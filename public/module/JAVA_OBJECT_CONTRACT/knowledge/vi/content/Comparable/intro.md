# Thứ tự tự nhiên với Comparable

Nếu một kiểu dữ liệu có **một thứ tự tự nhiên rõ ràng**, chính kiểu đó có thể công bố cách so sánh thông qua `Comparable<T>`.

`Comparable` không chỉ phục vụ `Collections.sort`. Quy tắc về thứ tự còn ảnh hưởng tới các thuật toán tìm kiếm nhị phân, `TreeSet`, `TreeMap` và mọi API dựa trên thứ tự tự nhiên.
