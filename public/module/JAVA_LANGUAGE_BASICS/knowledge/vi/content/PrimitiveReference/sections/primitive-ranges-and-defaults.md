Java có tám kiểu nguyên thủy:

```text
byte, short, int, long
float, double
char
boolean
```

Các kiểu nguyên thủy số nguyên có phạm vi cố định; số chấm động tuân theo IEEE 754; `char` là một code unit UTF-16 16-bit; `boolean` biểu diễn logic `true/false`.

Literal số cũng có kiểu ở thời điểm biên dịch. Hậu tố như `L`, `F`, tiền tố hệ cơ số hoặc biểu thức hằng có thể quyết định phép gán có hợp lệ hay không.

### Các kiểu nguyên thủy cần nhớ theo vai trò

| Nhóm | Kiểu | Ghi nhớ thực tế |
|---|---|---|
| số nguyên | `byte`, `short`, `int`, `long` | `int` là lựa chọn mặc định cho phép toán số nguyên; `long` dùng khi cần phạm vi lớn hơn |
| số chấm động | `float`, `double` | literal thập phân mặc định là `double`; `float` thường cần hậu tố `F` |
| ký tự | `char` | một code unit UTF-16, không đồng nghĩa “một ký tự Unicode hoàn chỉnh” trong mọi trường hợp |
| boolean | `boolean` | chỉ mang `true` hoặc `false`, không chuyển ngầm từ/sang số |

### Phạm vi và kích thước cần nắm

Với kiểu nguyên thủy số nguyên, Java định nghĩa kích thước/phạm vi ổn định giữa các nền tảng:

| Kiểu | Kích thước | Phạm vi |
|---|---:|---|
| `byte` | 8-bit signed | `-128 .. 127` |
| `short` | 16-bit signed | `-32_768 .. 32_767` |
| `int` | 32-bit signed | `-2^31 .. 2^31 - 1` |
| `long` | 64-bit signed | `-2^63 .. 2^63 - 1` |
| `char` | 16-bit unsigned | `0 .. 65_535` UTF-16 code unit |

`float` là IEEE 754 binary32 và `double` là IEEE 754 binary64. Ở `language-basics`, điều quan trọng là nhận ra chúng là biểu diễn số chấm động có giới hạn độ chính xác; overflow/rounding/NaN/Infinity được đào sâu trong mô-đun `numbers`.

Các hằng chuẩn như `Integer.MIN_VALUE`, `Integer.MAX_VALUE`, `Long.MIN_VALUE`, `Long.MAX_VALUE` thường rõ hơn việc ghi cứng các giá trị biên trong mã thật.

### Literal cũng có kiểu và cú pháp riêng

```java
int decimal = 10;
int hex = 0xFF;
int binary = 0b1010;
int octal = 012;          // 10 ở hệ 10

long big = 8_000_000_000L;

double ratio = 1.5;
float smallRatio = 1.5F;
double scientific = 1.2e3;

char letter = 'A';
char newline = '\n';
boolean active = true;
```

Một vài quy tắc thực tế:

- literal số nguyên mặc định thường là `int` nếu giá trị nằm trong phạm vi; dùng `L` khi cần `long`;
- literal số chấm động mặc định là `double`; dùng `F` cho `float`;
- `_` có thể làm số dễ đọc hơn nhưng chỉ được đặt ở những vị trí cú pháp hợp lệ;
- literal bắt đầu bằng `0` có thể là bát phân, nên `012` không phải số thập phân `12`;
- literal `char` dùng dấu nháy đơn, literal `String` dùng dấu nháy kép.

Ví dụ literal và kiểu ở thời điểm biên dịch:

```java
long population = 8_000_000_000L;
float ratio = 0.5F;
int hex = 0xFF;
int binary = 0b1010;
```
