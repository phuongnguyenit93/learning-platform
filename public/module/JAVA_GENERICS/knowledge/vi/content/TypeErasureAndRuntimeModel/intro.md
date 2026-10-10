# Xóa kiểu (Type Erasure) và mô hình lúc chạy

Đến đây compiler có vẻ biết rất nhiều thông tin kiểu:

```java
List<String> texts = new ArrayList<>();
List<Integer> numbers = new ArrayList<>();
```

Nhưng nếu nhìn ở lúc chạy:

```java
System.out.println(texts.getClass() == numbers.getClass()); // true
```

Nếu `String` và `Integer` quan trọng với Generics, **tại sao lúc chạy lại thấy cùng một class `ArrayList`?**

Câu trả lời là Java Generics chủ yếu được kiểm tra **khi biên dịch**. Compiler dùng type argument để kiểm tra mã nguồn, rồi dịch các khai báo/lời gọi generic sang bytecode tương thích với mô hình class cũ của JVM.

Cơ chế dịch đó được gọi là **type erasure**.

Hiểu erasure giúp nối nhiều câu hỏi tưởng như không liên quan:

- vì sao `List<String>` và `List<Integer>` có cùng class ở lúc chạy;
- vì sao một tham chiếu rộng như `Object` không thể tùy ý được kiểm tra thành `List<String>`;
- vì sao compiler đôi khi chèn phép ép kiểu;
- vì sao xuất hiện bridge method;
- vì sao nhiều giới hạn ở chương sau tồn tại.
