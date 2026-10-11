Với kiểu số nguyên, Java hỗ trợ:

```text
& | ^ ~
<< >> >>>
```

`>>` giữ bit dấu theo dịch số học; `>>>` chèn bit `0` theo dịch logic.

Khoảng dịch cũng được giới hạn theo độ rộng của kiểu. Mã thao tác bit nên đi cùng kiểm thử rõ ràng vì lỗi về dấu hoặc độ rộng thường khó nhận ra bằng mắt.

Ví dụ:

```java
int flags = 0b0101;
int mask  = 0b0001;
boolean enabled = (flags & mask) != 0;
```

Toán tử bit là công cụ mức thấp. Với các cờ nghiệp vụ thông thường, `enum`/`Set` thường diễn đạt ý định rõ hơn; bitmask phù hợp khi giao thức, biểu diễn nhỏ gọn hoặc API mức thấp yêu cầu.
