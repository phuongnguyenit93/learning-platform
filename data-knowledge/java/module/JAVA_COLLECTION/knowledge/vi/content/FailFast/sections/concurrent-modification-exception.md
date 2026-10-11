Tên `ConcurrentModificationException` dễ khiến người học nghĩ rằng phải có hai luồng. Thực tế một luồng duy nhất cũng có thể gây CME khi nó sửa collection qua tham chiếu collection trong lúc đang dùng iterator của collection đó. Ví dụ dưới đây dùng trực tiếp iterator của `ArrayList` để điểm phát hiện rõ ràng:

```java
List<String> users = new ArrayList<>(List.of("U01", "U02", "U03"));
Iterator<String> iterator = users.iterator();

System.out.println(iterator.next()); // U01

users.add("U04");                   // thay đổi cấu trúc ngoài iterator

iterator.next();                    // iterator ArrayList phát hiện trạng thái không khớp -> CME
```

Vòng lặp for-each trên collection cũng dùng iterator ở phía dưới, nên cùng nguyên tắc áp dụng khi sửa trực tiếp collection trong vòng lặp. Tuy nhiên fail-fast chỉ cố gắng phát hiện lỗi và không bảo đảm tuyệt đối; không nên cố tình viết mã sai rồi dựa vào việc “chắc chắn sẽ có CME” để bảo vệ tính đúng đắn.

CME nên được đọc là: **iterator phát hiện collection bị sửa theo cách làm quy ước duyệt không còn hợp lệ**. Nó không chứng minh có tranh chấp dữ liệu (data race), cũng không phải tín hiệu để `catch` rồi bỏ qua.

Trong môi trường nhiều luồng, việc chọn `ConcurrentHashMap`, `CopyOnWriteArrayList`, khóa hoặc mô hình sở hữu thuộc bài toán xử lý đồng thời rộng hơn. Iterator của collection hỗ trợ xử lý đồng thời có thể có quy ước khác, chẳng hạn **nhất quán yếu (weakly consistent)**, nên không thể áp logic fail-fast của `ArrayList` cho mọi collection.
