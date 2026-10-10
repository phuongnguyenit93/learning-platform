**Thứ tự duyệt** là thứ tự mà một thao tác tuần tự nhìn thấy các phần tử khi đi qua collection. Nó mô tả cách dữ liệu được gặp, không mặc định có nghĩa là “thứ tự thêm vào” hoặc “đã được sắp xếp”.

Ví dụ:

- `ArrayList` gặp phần tử theo thứ tự chỉ số.
- `LinkedHashSet` duy trì thứ tự gặp dựa trên thứ tự chèn.
- `TreeSet` gặp phần tử theo thứ tự sắp xếp của set.
- `HashSet` không cam kết một thứ tự duyệt cụ thể; không nên viết logic phụ thuộc vào thứ tự quan sát tình cờ của nó.

Java 21 đưa khái niệm này thành API rõ hơn qua `SequencedCollection`, `SequencedSet` và `SequencedMap`. Chẳng hạn `List` là một `SequencedCollection`, còn `SortedSet` là một `SequencedSet`. Các mô hình trừu tượng này định nghĩa khả năng truy cập đầu/cuối và **khung nhìn theo thứ tự ngược (reverse-ordered view)** qua `reversed()`. Các thao tác thay đổi ở đầu/cuối như `addFirst`, `addLast`, `removeFirst` hoặc `removeLast` là thao tác tùy chọn và vẫn có thể không được lớp triển khai cụ thể hỗ trợ.

```java
List<Order> original = new ArrayList<>(orders);
List<Order> reversed = original.reversed();

System.out.println(reversed.getFirst()); // phần tử cuối của original
```

`reversed()` trả về một khung nhìn theo thứ tự ngược, không phải bản sao độc lập. Thay đổi cấu trúc ở một phía có thể được quan sát từ phía còn lại nếu collection đó cho phép thay đổi. Vì vậy, khi API yêu cầu một bản chụp độc lập, cần tạo bản sao thay vì chỉ lấy khung nhìn.

Điểm quan trọng là **thứ tự duyệt là thuộc tính của collection/khung nhìn tại thời điểm duyệt**. Một `List` có thứ tự duyệt xác định nhưng chưa chắc đã “được sắp xếp”; `HashSet` có thể in ra cùng một thứ tự trong vài lần chạy nhưng vẫn không có quy ước bảo đảm thứ tự đó.
