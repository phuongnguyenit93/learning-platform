Mảng nhiều chiều trong Java thực chất là **mảng chứa mảng**:

```java
int[][] matrix = new int[2][3];
```

Mỗi hàng là một `int[]` riêng, nên mảng “răng cưa” (jagged array) hoàn toàn hợp lệ:

```java
int[][] data = {
    {1, 2},
    {3, 4, 5}
};
```

Không nên mặc định nó là một ma trận chữ nhật liên tục trong bộ nhớ như ở một số mô hình ngôn ngữ khác.

Mỗi hàng có thể có độ dài khác nhau hoặc thậm chí là `null`:

```java
int[][] data = new int[3][];
data[0] = new int[2];
data[1] = new int[5];
// data[2] vẫn null
```

Do đó mã vòng lặp lồng nhau nên dùng `data[row].length` cho từng hàng và xử lý hàng `null` nếu hợp đồng cho phép.

Chương tiếp theo dùng mảng làm nền để giải thích `varargs` và cách dữ liệu đi qua lời gọi phương thức.
