### KHÁI NIỆM

`int` là số nguyên có dấu 32 bit. Giá trị lớn nhất và nhỏ nhất là:

```text
Integer.MIN_VALUE = -2^31
Integer.MAX_VALUE =  2^31 - 1
```

Khi phép toán đi ra ngoài phạm vi đó, kết quả quay vòng theo quy tắc của số nguyên độ rộng cố định:

```java
int value = Integer.MAX_VALUE;
value++;

System.out.println(value); // Integer.MIN_VALUE
```

### VÌ SAO nguy hiểm?

Tràn số thường **không tạo ngoại lệ**:

```text
đầu vào hợp lệ
    ↓
phép toán bị tràn số
    ↓
giá trị quay vòng nhưng vẫn là int hợp lệ
    ↓
logic nghiệp vụ tiếp tục chạy với dữ liệu sai
```

Nếu giá trị là số lượng, số xu, bộ đếm, thời gian chờ, độ lệch hoặc dung lượng, lỗi có thể xuất hiện rất xa nơi tràn số thực sự xảy ra.

### CƠ CHẾ — kết quả trung gian mới là nơi cần nhìn

```java
int quantity = 1_000_000;
int unitPrice = 10_000;

long total = quantity * unitPrice;
```

Phép nhân vẫn là `int * int`. Phép gán sang `long` diễn ra **sau phép toán**.

Cách đúng nếu phạm vi của kết quả cần `long`:

```java
long total = (long) quantity * unitPrice;
```

Tương tự:

```java
long a = 3_000_000_000L;
long b = 4_000_000_000L;

long product = a * b; // long cũng có thể overflow
```

Đổi từ `int` sang `long` chỉ tăng phạm vi, không loại bỏ nguy cơ tràn số vĩnh viễn.
