Comparator phải tạo ra một quan hệ thứ tự nhất quán.

### ĐỐI XỨNG NGƯỢC VỀ DẤU

Nếu:

```text
compare(a, b) < 0
```

thì chiều ngược lại phải cho:

```text
compare(b, a) > 0
```

Tổng quát hơn, dấu của hai phép so sánh đảo đối số phải đối nhau. Nếu không, comparator có thể đồng thời nói “a đứng trước b” và “b cũng đứng trước a”.

### TÍNH BẮC CẦU

Nếu comparator nói:

```text
a < b
b < c
```

thì nó phải duy trì:

```text
a < c
```

Một comparator kiểu vòng tròn “kéo-búa-bao” không tạo được thứ tự toàn phần hợp lệ cho thuật toán sắp xếp hoặc cấu trúc cây.

### CÁC PHẦN TỬ SO SÁNH BẰNG 0 PHẢI HÀNH XỬ NHẤT QUÁN

Nếu:

```text
compare(a, b) == 0
```

thì với một phần tử thứ ba `c`, dấu của:

```text
compare(a, c)
```

phải nhất quán với dấu của:

```text
compare(b, c)
```

Quy tắc này giúp nhóm các phần tử “bằng nhau theo thứ tự” thực sự tạo thành một lớp thứ tự nhất quán.

### TÍNH NHẤT QUÁN VỚI PHÉP BẰNG NHAU

Thứ tự do `Comparator` tạo ra được gọi là **nhất quán với `equals`** khi:

```text
(compare(a, b) == 0)
        ↕ tương đương
a.equals(b)
```

Comparator không bắt buộc tuyệt đối phải giữ sự nhất quán này, nhưng nếu phá nó thì đoạn mã sử dụng phải hiểu hậu quả, đặc biệt với `TreeSet` và `TreeMap`. Hai cấu trúc này vẫn có hành vi xác định dựa trên thứ tự, nhưng có thể không còn tuân thủ đầy đủ quy tắc chung của `Set`/`Map` nếu quan hệ “bằng nhau theo thứ tự” không khớp với `equals`.

Hai dạng không nhất quán đã thấy ở `Comparable` vẫn áp dụng khi thứ tự đến từ `Comparator`:

```text
a.equals(b) == false
compare(a, b) == 0

a.equals(b) == true
compare(a, b) != 0
```

Trường hợp đầu có thể làm cấu trúc dữ liệu có thứ tự xem hai giá trị logic khác nhau như cùng một khóa theo thứ tự; trường hợp sau có thể làm nó giữ cả hai giá trị dù `equals` nói chúng bằng nhau. Điểm khác biệt ở đây là chính sách so sánh do đoạn mã sử dụng cung cấp và có thể thay đổi theo ngữ cảnh, thay vì nằm cố định trong kiểu dữ liệu như `Comparable`.

Nếu cố ý định nghĩa thứ tự không nhất quán với `equals`, nên ghi rõ điều đó trong tài liệu để đoạn mã sử dụng không nhầm ngữ nghĩa của cấu trúc dữ liệu có thứ tự với phép bằng nhau về mặt logic của đối tượng.

```java
Set<Book> books = new TreeSet<>(Comparator.comparing(Book::title));
```

Nếu hai quyển sách khác nhau nhưng cùng tiêu đề, comparator trên có thể làm `TreeSet` chỉ giữ một khóa theo thứ tự. Đó không phải lỗi của `TreeSet`; comparator đã nói với cấu trúc dữ liệu rằng chúng bằng nhau theo quan hệ thứ tự.

### TRẠNG THÁI SO SÁNH CÓ THỂ THAY ĐỔI

Comparator dựa trên trường dữ liệu có thể thay đổi có thể làm cấu trúc dữ liệu có thứ tự mất tính nhất quán nếu trường đó thay đổi sau khi phần tử được đưa vào.

```text
đưa vào với price = 10
        ↓
vị trí trong cây dựa trên price 10
        ↓
đổi price = 1000
        ↓
trạng thái đối tượng không còn khớp vị trí cũ trong thứ tự
```

Rủi ro tương tự xảy ra nếu comparator phụ thuộc vào cấu hình bên ngoài có thể thay đổi, thời gian hiện tại hoặc trạng thái bên ngoài thay đổi giữa các lần so sánh. Hãy ưu tiên trạng thái liên quan tới thứ tự và chính sách so sánh ổn định khi đối tượng nằm trong cấu trúc cây.
