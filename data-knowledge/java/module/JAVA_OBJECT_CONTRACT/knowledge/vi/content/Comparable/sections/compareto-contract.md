Dấu của kết quả `compareTo` mang ý nghĩa:

```text
< 0  → this đứng trước other
  0  → cùng vị trí theo thứ tự
> 0  → this đứng sau other
```

Đoạn mã sử dụng chỉ nên dựa vào **dấu**, không dựa vào giá trị cụ thể như `-1`, `0`, `1`.

### ĐỐI XỨNG NGƯỢC VỀ DẤU

Nếu:

```text
sign(a.compareTo(b)) < 0
```

thì phải có quan hệ ngược lại:

```text
sign(b.compareTo(a)) > 0
```

### TÍNH BẮC CẦU

Nếu:

```text
a < b
b < c
```

thì quan hệ thứ tự phải cho:

```text
a < c
```

Nếu quan hệ so sánh không có tính bắc cầu, thuật toán sắp xếp và cấu trúc cây không còn một thứ tự nhất quán để dựa vào.

### TÍNH NHẤT QUÁN CỦA THỨ TỰ

Nếu hai đối tượng không thay đổi trạng thái liên quan tới thứ tự, kết quả so sánh không nên thay đổi ngẫu nhiên theo thời gian hoặc theo trạng thái bên ngoài.

Quy tắc còn cần một tính chất tinh tế nhưng quan trọng: nếu `a.compareTo(b) == 0`, thì `a` và `b` phải có cùng quan hệ thứ tự đối với một phần tử thứ ba `c`.

```text
a.compareTo(b) == 0
        ↓
sign(a.compareTo(c))
phải giống
sign(b.compareTo(c))
```

Nếu không, hai giá trị vừa được tuyên bố là cùng vị trí trong thứ tự lại hành xử khác nhau khi đặt cạnh phần tử thứ ba, khiến quan hệ thứ tự không còn nhất quán.

### ĐỪNG SO SÁNH BẰNG PHÉP TRỪ

Không nên viết:

```java
return this.id - other.id;
```

vì tràn số nguyên có thể đảo dấu kết quả.

Ví dụ:

```java
int a = Integer.MAX_VALUE;
int b = -1;

int result = a - b; // overflow
```

Dùng:

```java
Integer.compare(this.id, other.id)
Long.compare(this.id, other.id)
```

hoặc các phương thức hỗ trợ của `Comparator` sẽ biểu đạt ý định an toàn hơn.

### `compareTo(null)`

Theo quy tắc của `Comparable`, gọi `x.compareTo(null)` phải ném `NullPointerException` dù `x.equals(null)` trả `false`. Thứ tự tự nhiên không dùng `null` như một giá trị ngang hàng hợp lệ. Nếu đoạn mã sử dụng cần chính sách “null đứng trước/sau”, đó là việc phù hợp hơn cho `Comparator.nullsFirst` hoặc `Comparator.nullsLast`.
