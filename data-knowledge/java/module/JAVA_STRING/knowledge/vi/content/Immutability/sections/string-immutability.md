Sau khi một đối tượng `String` được tạo, nội dung logic của đối tượng đó không bị thay đổi tại chỗ.

### KHÁI NIỆM — bất biến nghĩa là gì?

Cần tách ba thứ thường bị gọi chung là “String”:

```text
biến String
→ giữ một tham chiếu

đối tượng String
→ đối tượng bất biến được tham chiếu trỏ tới

giá trị String
→ nội dung văn bản mà đối tượng biểu diễn
```

Tính bất biến áp vào **đối tượng/giá trị**, không có nghĩa biến giữ tham chiếu không thể được gán lại.

```java
String s = "java";
s.toUpperCase();
System.out.println(s); // java
```

`toUpperCase()` không sửa đối tượng cũ; nó trả về một giá trị String khác nếu nội dung cần thay đổi.

```text
s ─────────────► "java"

s = s.toUpperCase()

s ─────────────► "JAVA"
```

Biến `s` trỏ sang kết quả khác; đối tượng biểu diễn `"java"` không bị biến thành `"JAVA"`.

### VÌ SAO

Tính bất biến mang lại nhiều lợi ích:

- String có thể được chia sẻ an toàn;
- hash code có thể ổn định khi String dùng làm khóa;
- String literal có thể được dùng chung qua String Pool;
- việc suy luận về các tham chiếu cùng trỏ tới một đối tượng trở nên đơn giản hơn;
- API không cần tạo bản sao phòng vệ chỉ để tránh bên gọi sửa nội dung String.

Các lợi ích này liên kết trực tiếp tới các chương sau:

```text
bất biến
→ có thể chia sẻ an toàn
→ String Pool / intern() có thể dùng chung định danh tham chiếu

bất biến
→ nội dung ổn định
→ equals/hashCode ổn định

bất biến
→ xây chuỗi lặp lại không sửa đối tượng cũ
→ cần hiểu phép nối chuỗi và StringBuilder
```

### CƠ CHẾ — Java duy trì quy ước này ra sao?

API công khai của `String` không cung cấp thao tác kiểu “đổi đơn vị mã tại chỉ số này ngay trong đối tượng”. Các phương thức biến đổi văn bản trả về một kết quả `String`.

Không nên học String dựa trên giả định rằng bên trong luôn là `char[]`. Cách biểu diễn nội bộ là chi tiết triển khai của JVM và đã thay đổi giữa các phiên bản Java. Quy ước cần dựa vào là:

```text
String hiện tại
        │
        ├── kiểm tra/tìm kiếm
        │      → không đổi giá trị
        │
        └── biến đổi
               → nhận kết quả String
```

### Ranh giới sao chép với `char[]` có thể thay đổi

Tính bất biến cũng phải được giữ khi String được tạo từ dữ liệu có thể thay đổi ở bên ngoài:

```java
char[] chars = {'j', 'a', 'v', 'a'};
String text = new String(chars);

chars[0] = 'J';

System.out.println(text); // java
System.out.println(chars); // Java
```

Thay đổi mảng gốc sau khi tạo String không được làm nội dung String thay đổi. Nếu String chỉ giữ bí danh trực tiếp tới mảng có thể thay đổi của bên gọi, quy ước bất biến sẽ bị phá.

Chiều ngược lại cũng tạo một bản sao để bên gọi có thể thay đổi độc lập:

```java
String text = "java";
char[] copy = text.toCharArray();

copy[0] = 'J';

System.out.println(text);            // java
System.out.println(new String(copy)); // Java
```

Mô hình tư duy:

```text
char[] đầu vào có thể thay đổi
        ↓ sao chép tại ranh giới
giá trị String bất biến
        ↓ sao chép tại ranh giới
char[] đầu ra có thể thay đổi
```

Điểm cần học là **không có bí danh tới mảng có thể thay đổi nào cho phép mã ứng dụng sửa nội dung một String đã tồn tại**. Cách biểu diễn nội bộ thực tế của String vẫn là chi tiết triển khai của JVM.
