Khi gọi thao tác tạo nội dung khác, phải sử dụng giá trị trả về:

```java
String s = " java ";
s.trim();       // bỏ kết quả
s = s.trim();   // s giờ tham chiếu tới "java"
```

Biến `s` vẫn có thể được gán lại; **đối tượng bất biến không đồng nghĩa biến `final`**.

### “Kết quả mới” không đồng nghĩa “chắc chắn tạo đối tượng mới”

Mã ứng dụng không nên suy luận rằng mọi phương thức String luôn cấp phát một đối tượng khác. Phương thức có thể trả lại chính đối tượng hiện tại khi kết quả không cần thay đổi, hoặc trình biên dịch/JVM có thể tối ưu quá trình tạo chuỗi.

Quy ước cần dựa vào là:

```text
nội dung String cũ không bị sửa tại chỗ
+
phương thức trả về String biểu diễn kết quả
```

Không dùng định danh tham chiếu để kiểm tra nội dung kết quả:

```text
result == s
→ hỏi về định danh tham chiếu

result.equals(s)
→ hỏi về nội dung
```

Chương tiếp theo dùng chính tính bất biến để giải thích vì sao Java có thể chia sẻ String literal trong pool.
