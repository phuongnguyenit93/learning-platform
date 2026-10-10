Khi thứ tự tự nhiên **nhất quán với `equals`**, hai biểu thức sau phải có cùng giá trị `boolean`:

```text
(compareTo(other) == 0)
        ↕ tương đương
equals(other)
```

Java khuyến nghị mạnh sự nhất quán này, dù bản thân `Comparable` không bắt buộc `compareTo(...) == 0` phải đồng nghĩa với `equals(...) == true`. Lý do không chỉ mang tính thẩm mỹ: cấu trúc dữ liệu có thứ tự dùng phép so sánh để xác định khóa theo thứ tự, trong khi quy tắc chung của `Set`/`Map` được diễn đạt theo `equals`.

### CẤU TRÚC DỮ LIỆU DỰA TRÊN MÃ BĂM VÀ CẤU TRÚC CÂY HIỂU “GIỐNG NHAU” KHÁC NHAU

Mô hình tư duy:

```text
HashSet / HashMap
→ dựa vào equals + hashCode

TreeSet / TreeMap
→ dựa vào compareTo hoặc Comparator
```

Nếu:

```text
a.equals(b) == false
a.compareTo(b) == 0
```

thì `HashSet` có thể giữ cả hai trong khi `TreeSet` có thể xem chúng là cùng một khóa theo thứ tự.

Chiều ngược lại cũng gây bất ngờ:

```text
a.equals(b) == true
a.compareTo(b) != 0
```

thì một `Set` có thứ tự có thể giữ cả hai giá trị dù `equals` nói chúng bằng nhau, khiến hành vi của cấu trúc có thứ tự lệch khỏi kỳ vọng thông thường của `Set`.

Ví dụ nổi tiếng là `BigDecimal`:

```java
BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("1.00");

System.out.println(a.equals(b));     // false
System.out.println(a.compareTo(b));  // 0
```

Kiểu dữ liệu được phép công bố thứ tự như vậy, nhưng đoạn mã sử dụng phải hiểu hậu quả khi chọn cấu trúc dữ liệu.

Nếu một lớp cố ý để thứ tự tự nhiên không nhất quán với `equals`, hành vi đó nên được ghi rõ trong tài liệu. `TreeSet`/`TreeMap` vẫn có hành vi xác định vì chúng dùng thứ tự để nhận diện khóa, nhưng cấu trúc dữ liệu khi đó có thể không còn tuân thủ đầy đủ quy tắc chung của `Set`/`Map`, nơi khái niệm bằng nhau được diễn đạt bằng `equals`.

### TRẠNG THÁI SẮP XẾP CÓ THỂ THAY ĐỔI

Giống khóa băm có thể thay đổi, việc thay đổi trường dữ liệu tham gia thứ tự khi đối tượng đang nằm trong `TreeSet`/`TreeMap` có thể làm cấu trúc cây không còn khớp với trạng thái thứ tự hiện tại của đối tượng.

Vì vậy khóa dùng trong cấu trúc có thứ tự nên có trạng thái liên quan tới thứ tự đủ ổn định.

Nếu một kiểu dữ liệu cần nhiều cách sắp xếp khác nhau, ta không nên nhét tất cả vào `compareTo`; đó là vai trò của `Comparator`.
