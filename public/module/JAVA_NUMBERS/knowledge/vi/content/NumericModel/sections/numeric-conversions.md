### Cơ chế quan trọng: kiểu của phép toán được quyết định trước phép gán

Trước khi phép toán số học chạy, Java áp dụng các quy tắc về chuyển đổi và nâng kiểu số (numeric promotion).

Các kiểu số nguyên nhỏ hơn `int` thường được nâng lên `int`:

```java
byte a = 10;
byte b = 20;

int result = a + b;
// byte invalid = a + b; // compile error
```

Đây là lý do `byte + byte` không tự cho ra `byte`.

Với biểu thức trộn nhiều kiểu:

```java
int i = 10;
long l = 20L;
double d = 1.5;

long x = i + l;
double y = l + d;
```

### Lỗi thường gặp: mở rộng kiểu ở phép gán không cứu được tràn số đã xảy ra

```java
int quantity = 1_000_000;
int price = 10_000;

long wrong = quantity * price;
```

Người mới thường nghĩ `wrong` là `long` nên an toàn. Nhưng luồng thực tế là:

```text
int * int
    ↓
phép toán chạy dưới dạng int
    ↓
có thể tràn số
    ↓
kết quả int đã bị sai
    ↓
chuyển sang long
```

Muốn phép nhân chạy dưới dạng `long`, phải mở rộng kiểu **trước khi thực hiện phép toán**:

```java
long correct = (long) quantity * price;
```

### Ép kiểu không phục hồi dữ liệu đã mất

```java
int overflowed = Integer.MAX_VALUE + 1;
long widened = (long) overflowed;
```

`widened` chỉ chứa phiên bản `long` của giá trị đã bị tràn. Ép kiểu ở bước cuối không thể quay lại phép toán ban đầu.

Tương tự, nếu phép toán `double` đã tạo sai số làm tròn rồi mới đưa vào `BigDecimal`, BigDecimal không thể biết ý nghĩa thập phân ban đầu mà người viết mã mong muốn là gì.

Chương tiếp theo bắt đầu với dạng lỗi dễ bỏ qua nhất của số nguyên: **bị tràn nhưng chương trình vẫn tiếp tục chạy**.
