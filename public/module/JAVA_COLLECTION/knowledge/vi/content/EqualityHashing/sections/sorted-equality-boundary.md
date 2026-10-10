`TreeSet` và `TreeMap` có một ranh giới khác: chúng tổ chức dữ liệu theo `compareTo` hoặc `Comparator`. Khi kết quả so sánh là `0`, collection có sắp xếp xem hai giá trị/khóa là cùng vị trí logic cho mục đích tính duy nhất.

Ví dụ kinh điển là `BigDecimal`:

```java
BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("1.00");

System.out.println(a.equals(b));      // false
System.out.println(a.compareTo(b));   // 0

Set<BigDecimal> hashed = new HashSet<>(List.of(a, b));
Set<BigDecimal> sorted = new TreeSet<>(List.of(a, b));

System.out.println(hashed.size()); // 2
System.out.println(sorted.size()); // 1
```

Đây không phải lỗi ngẫu nhiên của `TreeSet`. Set đang dùng quan hệ tương đương theo thứ tự để xác định vị trí. Tuy nhiên, nếu thứ tự không nhất quán với `equals`, Set có sắp xếp có thể không tuân theo trực giác chung về tính bằng nhau của `Set` và gây bất ngờ cho bên gọi.

Khi tạo comparator cho `TreeSet`/`TreeMap`, hãy tự hỏi: “Nếu comparator trả `0`, tôi có thực sự muốn collection coi hai giá trị này là cùng khóa/phần tử không?”. Nếu câu trả lời là không, comparator cần thêm tiêu chí phân xử.
