Upcast từ kiểu con lên kiểu cha thường được thực hiện ngầm:

```java
Dog dog = new Dog();
Animal animal = dog;
```

Đối tượng không thay đổi; chỉ kiểu tĩnh của tham chiếu trở nên tổng quát hơn.

Downcast cần ép kiểu tường minh:

```java
Dog dogAgain = (Dog) animal;
```

Ép kiểu hợp lệ lúc biên dịch chưa bảo đảm đối tượng thực tế lúc chạy thuộc kiểu đích.

### Ép kiểu tham chiếu không biến đối tượng thành kiểu khác

```java
Animal animal = new Dog();
Dog dog = (Dog) animal;
```

Không có đối tượng mới và đối tượng `Dog` không bị “chuyển thành” kiểu khác. Phép ép kiểu chỉ yêu cầu Java kiểm tra rằng đối tượng thực tế có thể được nhìn qua kiểu tham chiếu đích.

`null` có thể ép sang kiểu tham chiếu mà không gây `ClassCastException`:

```java
Dog dog = (Dog) null; // hợp lệ, dog == null
```

Lỗi chỉ xuất hiện khi truy cập qua `dog` hoặc khi ép một đối tượng khác `null` nhưng không tương thích.
