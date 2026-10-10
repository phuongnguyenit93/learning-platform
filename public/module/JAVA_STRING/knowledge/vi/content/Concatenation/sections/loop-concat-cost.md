Trong vòng lặp lớn:

```java
String[] parts = {"java", "-", "core"};
String result = "";
for (String part : parts) {
    result += part;
}
```

mỗi bước có thể tạo thêm String trung gian và chi phí sao chép giá trị.

Mô hình tư duy:

```text
""
 + part1 → kết quả 1
 + part2 → kết quả 2 lớn hơn
 + part3 → kết quả 3 lớn hơn
 ...
```

Khi văn bản tăng dần qua nhiều vòng lặp, cùng một phần tiền tố có thể bị sao chép nhiều lần. Với khối lượng xử lý đủ lớn, tổng chi phí sao chép tăng đáng kể so với dùng một bộ đệm có thể thay đổi.

Nếu đang xây một chuỗi tăng dần qua nhiều bước, `StringBuilder` thể hiện mục đích rõ hơn và thường hiệu quả hơn.

Điều đó **không có nghĩa mọi dấu + đều xấu**:

```java
String fullName = firstName + " " + lastName;
```

Một biểu thức nhỏ và rõ ràng thường nên giữ đơn giản. `StringBuilder` có giá trị nhất khi quá trình xây chuỗi là **tăng dần qua nhiều bước**, đặc biệt trong vòng lặp hoặc nhánh xử lý phức tạp.

Chương tiếp theo đi vào chính bộ đệm có thể thay đổi đó.
