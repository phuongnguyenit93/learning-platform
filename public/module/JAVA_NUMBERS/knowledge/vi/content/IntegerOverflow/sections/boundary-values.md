### Vì sao MIN_VALUE đặc biệt?

Kiểu số nguyên có dấu dùng biểu diễn bù hai (two's complement) có một giá trị âm nhiều hơn phía dương:

```text
int
min = -2147483648
max =  2147483647
```

Vì vậy:

```java
int abs = Math.abs(Integer.MIN_VALUE);
System.out.println(abs); // vẫn là Integer.MIN_VALUE
```

`Math.abs` không thể trả `2147483648` dưới dạng `int` vì giá trị đó nằm ngoài phạm vi. Với overload nhận `int` này, kết quả bị tràn và vẫn là `Integer.MIN_VALUE`; phương thức không tự ném ngoại lệ chỉ vì trường hợp này.

Tương tự, phép:

```java
int x = Integer.MIN_VALUE / -1;
System.out.println(x); // Integer.MIN_VALUE
```

Về toán học cần `2147483648`, nhưng `int` không biểu diễn được. Java định nghĩa trường hợp tràn đặc biệt này trả lại `Integer.MIN_VALUE` thay vì ném ngoại lệ tràn số; chỉ phép chia cho 0 mới ném `ArithmeticException` trong phép chia số nguyên.

### Kiểm thử giá trị biên

Khi logic có nguy cơ chạm giới hạn phạm vi, nên kiểm thử:

```text
MIN_VALUE
MIN_VALUE + 1
-1
0
1
MAX_VALUE - 1
MAX_VALUE
```

và các biểu thức có **phép nhân/phép cộng trung gian**.

Nếu bài toán thực sự có thể vượt `long`, đừng vá từng trường hợp tràn số. Khi đó cách biểu diễn phù hợp hơn là `BigInteger`.

Trước khi tới `BigInteger`, ta cần hiểu một đánh đổi khác: số dấu phẩy động không quay vòng theo cùng kiểu nhưng lại **không biểu diễn chính xác mọi phân số thập phân**.
