Một biến `final` chỉ được nhận giá trị **một lần** theo quy tắc gán chắc chắn của Java. Giá trị có thể được gán ngay khi khai báo hoặc được gán sau đó đúng một lần trên mọi đường khởi tạo hợp lệ.

```java
final int x = 10;
final List<String> names = new ArrayList<>();
```

Với biến tham chiếu, `final` ngăn `names` trỏ sang danh sách khác, nhưng **không làm danh sách phía sau trở thành bất biến**:

```java
names.add("A"); // vẫn có thể hợp lệ
```

Đây là điểm phân biệt quan trọng khi học đối tượng bất biến (immutable object) sau này.

`final` còn có ý nghĩa khác tùy loại khai báo:

```text
biến final
→ giá trị/tham chiếu không được gán lại sau lần gán hợp lệ duy nhất

phương thức final
→ lớp con không được ghi đè phương thức đó

lớp final
→ không thể tạo lớp con từ lớp đó
```

Chương này chỉ cần thiết lập ranh giới khái niệm; ghi đè phương thức và thiết kế kế thừa được học sâu trong mô-đun OOP.
