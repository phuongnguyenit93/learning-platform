Ví dụ cùng một danh sách `Book` có thể được sắp xếp theo:

- tiêu đề;
- ngày xuất bản;
- giá;
- đánh giá;
- nhiều trường dữ liệu kết hợp.

Không nên sửa lớp nghiệp vụ mỗi khi cần thêm một góc nhìn.

```java
Comparator<Book> byTitle =
        Comparator.comparing(Book::title);

Comparator<Book> byPrice =
        Comparator.comparing(Book::price);
```

Chọn `byTitle`, `byPrice` hay một `Comparator` khác chỉ thay đổi **cách đoạn mã sử dụng sắp thứ tự các `Book`**. Nó không viết lại `Book.equals` và cũng không tự thay đổi quy tắc bằng nhau của nghiệp vụ. Thứ tự và phép bằng nhau về mặt logic là hai chính sách riêng, dù khi dùng cấu trúc dữ liệu có thứ tự ta có thể quan sát rõ sự tương tác giữa chúng.

Một `Comparator` đúng cũng phải áp đặt một **thứ tự toàn phần** trên tập giá trị mà nó được thiết kế để so sánh. Nếu chính sách cho phép `null`, chính comparator phải nói rõ `null` nằm ở đâu trong thứ tự đó.

### THỨ TỰ TỰ NHIÊN VÀ GÓC NHÌN NGHIỆP VỤ KHÔNG PHẢI MỘT

Một kiểu dữ liệu có thể có thứ tự tự nhiên nhưng đoạn mã sử dụng vẫn cần comparator khác.

Ví dụ `Version` có thứ tự tự nhiên theo phiên bản ngữ nghĩa, nhưng giao diện người dùng có thể cần hiển thị theo ngày phát hành. `Comparable` không nên bị sửa chỉ để phục vụ một màn hình cụ thể.
