`Comparable.compareTo` và `Comparator.compare` không yêu cầu trả đúng `-1`, `0`, `1`. Quy ước chỉ quan tâm **dấu** của kết quả:

```text
compare(a, b) < 0
→ a đứng trước b theo thứ tự so sánh

compare(a, b) == 0
→ a và b bằng nhau theo thứ tự so sánh

compare(a, b) > 0
→ a đứng sau b theo thứ tự so sánh
```

Ví dụ:

```java
int result = Long.compare(orderA.id(), orderB.id());
```

Nếu `result < 0`, `orderA` đứng trước `orderB` theo id. Bên gọi không nên kiểm tra `result == -1` hay `result == 1`, vì cách triển khai được phép trả bất kỳ số âm/dương nào miễn đúng dấu.

Khi dùng thứ tự cho `TreeSet`/`TreeMap`, kết quả `0` còn ảnh hưởng tính duy nhất của phần tử/khóa. Vì vậy “bằng nhau theo thứ tự” là một khái niệm có hậu quả thực tế, không chỉ là chi tiết của thao tác sắp xếp.
