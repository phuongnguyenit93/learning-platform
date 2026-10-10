Nếu tham chiếu trỏ tới đối tượng không tương thích với kiểu đích, downcast thất bại ở thời điểm chạy:

```java
Animal animal = new Cat();
Dog dog = (Dog) animal; // ClassCastException
```

Trình biên dịch chỉ biết quan hệ giữa các kiểu; kiểm tra ở thời điểm chạy mới biết đối tượng thực tế.

Mô hình tư duy:

```text
thời điểm biên dịch
→ phép ép kiểu có hợp lệ về quan hệ kiểu không?

thời điểm chạy
→ đối tượng thật có tương thích kiểu đích không?
```

Nếu bạn đang dùng cast chỉ để “ép cho biên dịch được”, đó thường là dấu hiệu cần dừng lại kiểm tra mô hình. Phép ép kiểu nên diễn đạt hiểu biết thật sự về quan hệ kiểu, không phải che lỗi thiết kế.

Hai phần này minh họa vì sao một phép ép kiểu có thể hợp lệ về quan hệ kiểu nhưng vẫn cần kiểm tra đối tượng thực tế ở thời điểm chạy.
