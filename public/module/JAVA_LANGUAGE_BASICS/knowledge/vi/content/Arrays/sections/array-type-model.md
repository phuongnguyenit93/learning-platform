```java
int[] numbers = new int[3];
String[] names = new String[3];
```

Mảng có:

- kiểu mảng thực tế ở thời điểm chạy;
- `length` cố định sau khi tạo;
- chỉ số bắt đầu từ `0`;
- giá trị mặc định của phần tử theo kiểu thành phần.

Mảng tự nó là một đối tượng, nên biến mảng có thể mang `null` và nhiều biến tham chiếu có thể cùng trỏ tới một mảng.

Phân biệt hai trạng thái:

```java
String[] a = null;          // không có đối tượng mảng
String[] b = new String[1]; // có đối tượng mảng, nhưng b[0] == null
int[] empty = new int[0];   // có đối tượng mảng thật, length = 0
```

`null` và mảng rỗng không mang cùng nghĩa: `null` là không có đối tượng mảng để truy cập, còn `new int[0]` tạo ra một đối tượng mảng hợp lệ chỉ đơn giản là không có phần tử.

### Khai báo khác tạo mảng

```java
int[] a;          // chỉ khai báo biến tham chiếu
a = new int[3];   // tạo đối tượng mảng rồi gán tham chiếu

int b[] = new int[3]; // hợp lệ nhưng cách viết int[] b thường dễ đọc hơn
```

`length` là thuộc tính cố định của mảng sau khi tạo:

```java
System.out.println(a.length);
```

Không có phương thức `length()` cho mảng.

### Mảng là đối tượng có thể thay đổi

```java
int[] first = {1, 2};
int[] second = first;
second[0] = 99;
```

`first[0]` cũng thành `99` vì phép gán chỉ sao chép tham chiếu. Muốn mảng độc lập cần sao chép phần tử bằng API phù hợp.
