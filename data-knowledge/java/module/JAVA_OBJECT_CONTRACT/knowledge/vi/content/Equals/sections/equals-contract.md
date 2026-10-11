Một cách triển khai `equals` đúng phải giữ các tính chất cơ bản:

```text
phản xạ (reflexive)
x.equals(x) luôn true

đối xứng (symmetric)
x.equals(y) và y.equals(x) phải cho cùng kết quả

bắc cầu (transitive)
nếu x.equals(y) và y.equals(z) đều true
thì x.equals(z) cũng phải true

nhất quán (consistent)
kết quả ổn định khi trạng thái liên quan không đổi

null
x.equals(null) phải false
```

Trình biên dịch không ép bạn giữ các quy tắc này, nhưng các cấu trúc dữ liệu và thư viện mặc định **tin rằng đối tượng của bạn tuân thủ chúng**.

### PHẢN XẠ (REFLEXIVE) — ĐỐI TƯỢNG PHẢI BẰNG CHÍNH NÓ

Nếu `x.equals(x)` có thể trả `false`, gần như mọi cấu trúc dựa trên phép bằng nhau đều mất nền tảng suy luận.

Vì vậy nhánh kiểm tra nhanh này vừa đúng quy tắc vừa thường có chi phí thấp:

```java
if (this == other) {
    return true;
}
```

### ĐỐI XỨNG (SYMMETRIC) — HAI CHIỀU PHẢI CÙNG KẾT QUẢ

Nếu:

```text
a.equals(b) == true
```

thì phải có:

```text
b.equals(a) == true
```

Tính đối xứng đặc biệt dễ bị phá khi kế thừa cho phép lớp con thêm trạng thái mới có ảnh hưởng tới phép bằng nhau.

### BẮC CẦU (TRANSITIVE) — PHÉP BẰNG NHAU KHÔNG ĐƯỢC “GÃY” QUA PHẦN TỬ TRUNG GIAN

Nếu:

```text
x.equals(y) == true
y.equals(z) == true
```

thì:

```text
x.equals(z) == true
```

Tính bắc cầu cho phép đoạn mã sử dụng xem phép bằng nhau như một quan hệ ổn định thay vì một chuỗi so sánh mâu thuẫn.

### NHẤT QUÁN (CONSISTENT) — KHÔNG TỰ THAY ĐỔI KHI TRẠNG THÁI KHÔNG ĐỔI

Một cách cài đặt phụ thuộc vào thời gian hiện tại, giá trị ngẫu nhiên hoặc I/O bên ngoài có thể khiến cùng hai đối tượng lúc thì bằng nhau, lúc thì không.

```java
// Cách làm không nên dùng: phép bằng nhau phụ thuộc thời gian
return Instant.now().getEpochSecond() % 2 == 0;
```

Đây là thiết kế sai vì đoạn mã sử dụng không thể dùng đối tượng một cách ổn định.
