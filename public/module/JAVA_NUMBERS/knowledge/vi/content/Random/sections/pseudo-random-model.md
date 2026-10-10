### KHÁI NIỆM

Có thể hình dung một bộ sinh số giả ngẫu nhiên như sau:

```text
seed / trạng thái nội bộ
        ↓
thuật toán xác định
        ↓
chuỗi giá trị
```

Cùng seed và cùng thứ tự gọi có thể tạo cùng đầu ra:

```java
Random a = new Random(42);
Random b = new Random(42);

System.out.println(a.nextInt(1000));
System.out.println(b.nextInt(1000));
// cùng kết quả nếu trạng thái/thứ tự gọi giống nhau
```

### VÌ SAO tính xác định lại hữu ích?

Trong kiểm thử/mô phỏng:

```text
dữ liệu trông ngẫu nhiên
        +
seed có thể tái lập
        =
lỗi có thể tái hiện
```

Kiểm thử có thể truyền seed cố định để cùng đầu vào tạo cùng chuỗi giá trị giữa các lần chạy.

### Sinh số ngẫu nhiên trong phạm vi

```java
int value = random.nextInt(100);
```

cho kết quả trong phạm vi:

```text
0 <= value < 100
```

Ưu tiên API có giới hạn phạm vi thay vì tự làm:

```java
random.nextInt() % 100
```

vì phép modulo thủ công có thể tạo kết quả âm và làm sai phân phối nếu xử lý không đúng.
