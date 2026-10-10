`Math` có thể nhóm thành:

```text
chọn giá trị cơ bản
→ abs, min, max

lũy thừa/căn
→ pow, sqrt, cbrt

tiện ích làm tròn
→ floor, ceil, round, rint

lượng giác/logarit
→ sin, cos, tan, log, exp

tiện ích số nguyên
→ floorDiv, floorMod, phép toán có kiểm tra tràn

tiện ích số dấu phẩy động
→ ulp, nextUp, nextDown, copySign...
```

### `floor`, `ceil`, `round`

```java
Math.floor(2.7);  // 2.0
Math.ceil(2.1);   // 3.0
Math.round(2.5);  // 3

Math.floor(-2.1); // -3.0
Math.ceil(-2.9);  // -2.0
```

`floor` nghĩa là đi về -∞, không phải “bỏ phần thập phân”.

### `floorDiv` và `floorMod`

Phép chia số nguyên thông thường của Java cắt về phía 0:

```java
System.out.println(-7 / 3); // -2
```

`Math.floorDiv` dùng phép chia lấy sàn:

```java
System.out.println(Math.floorDiv(-7, 3)); // -3
```

Khi thuật toán cần đúng ngữ nghĩa lấy sàn toán học với số âm, điểm khác biệt này rất quan trọng.
