Quy tắc lựa chọn nhanh:

```text
không cần bộ đệm có thể thay đổi dùng chung giữa nhiều luồng
→ StringBuilder

thật sự cần bộ đệm ký tự có thể thay đổi với đồng bộ hóa nội bộ
→ cân nhắc StringBuffer
```

Trong nhiều thiết kế tốt, thay vì chia sẻ một bộ đệm có thể thay đổi giữa nhiều luồng, mỗi luồng xây kết quả riêng rồi kết hợp ở một ranh giới rõ ràng.

So sánh thực dụng:

```text
xây chuỗi cục bộ trong một luồng
→ StringBuilder

API cũ yêu cầu StringBuffer
→ StringBuffer

bộ đệm dùng chung thật sự cần đồng bộ hóa ở mức từng phương thức
→ cân nhắc StringBuffer, nhưng phải rà soát toàn bộ luồng xử lý
```

Không chọn `StringBuffer` chỉ vì “an toàn luồng nghe an toàn hơn”. Đồng bộ hóa có chi phí và trạng thái có thể thay đổi dùng chung làm thiết kế phức tạp hơn.
