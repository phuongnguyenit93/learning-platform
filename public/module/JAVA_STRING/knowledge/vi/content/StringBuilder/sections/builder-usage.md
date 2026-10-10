`StringBuilder` phù hợp khi:

- vòng lặp append nhiều phần;
- định dạng đầu ra theo nhiều nhánh;
- tạo văn bản trong phạm vi một phương thức hoặc một luồng;
- cần giảm số String trung gian.

Sau khi gọi `toString()`, String kết quả là bất biến và độc lập về ngữ nghĩa với các thay đổi tiếp theo của `StringBuilder`.

### Giá trị chụp lại tại thời điểm gọi toString

```java
StringBuilder b = new StringBuilder("java");

String first = b.toString();
b.append("-core");
String second = b.toString();

System.out.println(first);  // java
System.out.println(second); // java-core
```

`first` không thay đổi khi `StringBuilder` tiếp tục bị sửa.

### Các thao tác thường gặp

Ngoài `append` còn có:

```text
insert(index, value)
delete(start, end)
replace(start, end, value)
reverse()
```

Chọn chúng khi thật sự đang chỉnh **bộ đệm xây chuỗi**. Nếu đã có giá trị String cuối cùng và chỉ cần biến đổi đơn giản, API String thường diễn đạt mục đích tốt hơn.

### Ranh giới an toàn luồng

`StringBuilder` không đồng bộ hóa nội bộ và không được thiết kế để một đối tượng có thể thay đổi bị nhiều luồng cùng sửa mà không có cơ chế phối hợp.

Mẫu sử dụng phổ biến:

```text
StringBuilder cục bộ trong phương thức/luồng
→ xây nội dung
→ toString
→ đưa giá trị String bất biến ra ngoài
```
