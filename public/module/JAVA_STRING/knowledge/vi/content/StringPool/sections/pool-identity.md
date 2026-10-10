Phép nối là biểu thức hằng tại thời điểm biên dịch tạo ra một hằng String được intern, nên có thể dùng cùng tham chiếu chuẩn hóa với literal tương ứng:

```java
String a = "ja" + "va";
String b = "java";
```

Trong khi phép nối phụ thuộc giá trị chỉ biết khi chạy không có cùng bảo đảm về định danh tham chiếu.

Quy tắc chính xác về **biểu thức hằng (constant expression)**, biến `final` và phép nối tại thời điểm biên dịch được trình bày ở chương Nối chuỗi; tại đây chỉ cần giữ mô hình tư duy rằng định danh tham chiếu trong String Pool phụ thuộc vào cách giá trị được tạo, còn so sánh nội dung vẫn dùng `equals`.

### Quy tắc thực dụng

```text
cùng đối tượng?
→ ==

cùng nội dung văn bản?
→ equals

cần tham chiếu chuẩn hóa trong pool một cách có chủ ý?
→ intern(), với đánh đổi rõ ràng
```

Đừng viết logic nghiệp vụ dựa trên định danh tham chiếu trong pool. String Pool là cơ chế chuẩn hóa/tái sử dụng tham chiếu của Java/JVM; với literal và hằng String, việc intern còn gắn với contract của Java chứ không chỉ là tối ưu triển khai. **So sánh nội dung văn bản vẫn dùng `equals`**.

Chương tiếp theo tập trung trực tiếp vào quy tắc so sánh String.
