Không thể tạo:

```java
// T[] values = new T[10];
// List<String>[] lists = new List<String>[10];
```

Mảng là reified và hiệp biến (covariant): runtime biết kiểu phần tử và kiểm tra khi ghi. Parameterized type như `List<String>` lại non-reifiable, nên JVM không thể thực hiện đầy đủ phép kiểm tra mà hợp đồng của mảng yêu cầu.

`List<?>[]` có thể tạo vì `List<?>` là reifiable:

```java
List<?>[] lists = new List<?>[10];
```

Trong code thực tế, sau khi học module Collection, bạn sẽ thường thấy collection được ưu tiên hơn mảng generic khi kích thước động và API không bắt buộc dùng mảng. Nếu tối ưu nội bộ hoặc API bắt buộc dùng mảng, unchecked cast phải được cô lập và điều kiện bất biến phải rất rõ.
