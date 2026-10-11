**Boxing** chuyển giá trị nguyên thủy sang kiểu bao; **unboxing** lấy giá trị nguyên thủy từ kiểu bao.

```java
Integer boxed = 10; // tự động đóng hộp
int value = boxed;  // mở hộp
```

Trình biên dịch chèn chuyển đổi tương ứng trong ngữ cảnh hợp lệ.

Tự động đóng hộp tiện nhưng không làm kiểu nguyên thủy và kiểu bao trở thành cùng một kiểu. Việc chọn overload, `null`, tính đồng nhất và hiệu năng vẫn có thể khác.

### Đóng hộp có thể xảy ra ở đâu?

```java
Integer a = 10;          // ngữ cảnh phép gán
List<Integer> xs = List.of(1, 2, 3); // đối số nguyên thủy được đóng hộp

void accept(Integer x) { }
accept(10);              // ngữ cảnh gọi phương thức
```

Mở hộp thường xuất hiện khi kiểu bao được dùng trong biểu thức cần giá trị nguyên thủy:

```java
Integer count = 10;
int next = count + 1; // count được mở hộp trước phép toán
```

Vì chuyển đổi có thể được trình biên dịch chèn ngầm, hãy đặc biệt cẩn thận ở ranh giới có `null`, overload hoặc đoạn mã lặp nhiều lần cần hiệu năng cao.
