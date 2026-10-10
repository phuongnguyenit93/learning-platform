Các dấu hiệu luồng điều khiển khó bảo trì:

- `if` lồng quá sâu;
- điều kiện boolean dài có tác dụng phụ;
- `switch` fall-through không chủ ý;
- vòng lặp có quá nhiều `break/continue` ở nhiều tầng;
- cùng một điều kiện được lặp ở nhiều nơi.

Guard clause, tách phương thức hoặc mô hình dữ liệu/đa hình tốt hơn đôi khi làm luồng rõ hơn.

### Guard clause để giảm lồng nhau

```java
if (user == null) {
    return;
}
if (!user.isActive()) {
    return;
}
process(user);
```

So với nhiều tầng `if`, guard clause thường đặt đường không hợp lệ/thoát lên trước và giữ đường xử lý chính phẳng hơn.

### Điều kiện kết thúc vòng lặp phải nhìn thấy được

Với `while`/`do-while`, hãy xác định rõ trạng thái nào làm điều kiện thay đổi. Vòng lặp vô hạn không phải luôn sai, nhưng nếu có chủ ý thì thường cần cơ chế dừng/ngắt rõ ở tầng phù hợp.

Chương tiếp theo giới thiệu mảng; tại đó enhanced-for sẽ được đặt trong ngữ cảnh một tập phần tử cụ thể.
