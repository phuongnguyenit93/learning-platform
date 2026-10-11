### KHÁI NIỆM

Biến kiểu nguyên thủy giữ trực tiếp một giá trị nguyên thủy:

```java
int age = 20;
boolean active = true;
```

Biến tham chiếu giữ một **giá trị tham chiếu** có thể nhận diện một đối tượng/mảng hoặc mang `null`:

```java
User user = new User();
int[] values = new int[3];
```

Điểm quan trọng: Java vẫn sao chép **giá trị** khi gán hoặc truyền đối số. Với biến tham chiếu, giá trị được sao chép chính là giá trị tham chiếu.

```java
User a = new User("A");
User b = a; // sao chép giá trị tham chiếu
```

`a` và `b` giờ cùng tham chiếu tới một đối tượng `User`.

### Vì sao phải phân biệt hai mô hình này?

Rất nhiều lỗi Java cơ bản xuất phát từ việc nghĩ rằng mọi biến đều “chứa đối tượng” theo cùng một cách. Thực tế, phép gán kiểu nguyên thủy sao chép giá trị nguyên thủy, còn phép gán kiểu tham chiếu sao chép giá trị tham chiếu. Vì vậy hai biến tham chiếu có thể là **hai biến khác nhau nhưng cùng nhận diện một đối tượng**.

```java
int x = 10;
int y = x;
y++;
// x vẫn là 10

User first = new User("A");
User second = first;
second.setName("B");
// first.getName() cũng là "B"
```

Mô hình tư duy nên giữ là:

```text
ô biến
    ↓ giữ
giá trị nguyên thủy

hoặc

ô biến
    ↓ giữ
giá trị tham chiếu ─────→ đối tượng
```

Không cần và không nên mô hình hóa tham chiếu như con trỏ C/C++ có thể cộng trừ địa chỉ. Java không cho phép phép toán số học trên tham chiếu.
