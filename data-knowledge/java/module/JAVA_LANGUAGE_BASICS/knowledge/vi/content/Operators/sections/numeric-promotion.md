Trong biểu thức số học, `byte`, `short` và `char` thường được thăng hạng lên `int`:

```java
byte a = 1;
byte b = 2;
int c = a + b;
```

Vì vậy `byte c = a + b;` thường không biên dịch được nếu không rơi vào quy tắc đặc biệt dành cho **biểu thức hằng** hoặc không có ép kiểu phù hợp.

Biểu thức trộn nhiều kiểu số cũng được nâng kiểu theo quy tắc **binary numeric promotion**. Hãy suy luận kiểu của **toàn bộ biểu thức**, không chỉ nhìn kiểu của từng toán hạng.

### Phép toán số học và chia số nguyên

```java
int a = 5 / 2;       // 2
double b = 5 / 2;    // 2.0 vì phép chia đã xảy ra bằng int
double c = 5 / 2.0;  // 2.5
```

Kiểu của toán hạng quyết định ngữ nghĩa phép toán trước khi kết quả được gán.

`%` trả phần dư theo phép toán số nguyên hoặc số thực tương ứng và thường dùng cho kiểm tra chẵn/lẻ hay logic theo chu kỳ:

```java
boolean even = number % 2 == 0;
```

### Phép gán kết hợp có chuyển đổi ngầm đặc biệt

```java
byte b = 1;
// b = b + 1; // không biên dịch: b + 1 là int
b += 1;        // hợp lệ: phép gán kết hợp có chuyển đổi về kiểu đích
```

`b += x` không hoàn toàn tương đương với việc viết lại thành `b = b + x`; quy tắc ngôn ngữ cho phép chuyển đổi ngầm tương ứng và chỉ đánh giá vế trái một lần.
