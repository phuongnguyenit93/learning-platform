Annotation processor nằm trong quy trình build nên tính ổn định rất quan trọng.

### 1. Không sinh cùng file nhiều lần

Nếu mỗi vòng lại gọi:

```java
createSourceFile("com.example.OrderMapperGenerated")
```

cho cùng type, processor có thể gặp `FilerException`. Hãy thiết kế quá trình sinh mã dựa trên đầu vào ổn định và theo dõi đầu ra đã sinh khi cần.

### 2. Không phụ thuộc thứ tự processor/collection không ổn định

Đầu ra nên có tính xác định:

```text
cùng mã nguồn + cùng tùy chọn
→ cùng đầu ra được sinh
```

Tránh timestamp, định danh ngẫu nhiên hoặc thứ tự từ collection không đảm bảo thứ tự nếu chúng không mang ý nghĩa nghiệp vụ/kỹ thuật cần thiết.

### 3. Không ghi đè mã nguồn của người dùng

Processor nên tạo đầu ra mới qua `Filer`, không dùng annotation processing như cơ chế sửa mã nguồn hiện có.

### 4. Tôn trọng nhiều vòng xử lý

Type được sinh có thể chỉ xuất hiện ở vòng sau. Đừng kết luận “thiếu type” quá sớm nếu chính quy trình đang sinh nó.

Vòng cuối (`processingOver() == true`) phù hợp để dọn dẹp/phát chẩn đoán cuối; không nên sinh type mà bạn kỳ vọng sẽ còn một vòng xử lý bình thường khác sau đó.

### 5. Nhận quyền xử lý (claim) Annotation có chủ đích

Chỉ trả về `true` khi processor thật sự muốn nhận quyền xử lý kiểu Annotation đó. Claim quá rộng có thể ngăn processor khác tham gia.

### 6. Tách mô hình tư duy giữa thời điểm biên dịch và thời gian chạy

```text
annotation processor
→ sinh mã / kiểm tra tại thời điểm biên dịch

framework ở thời gian chạy
→ đọc siêu dữ liệu RUNTIME khi ứng dụng chạy
```

Hai cơ chế có thể cùng dùng Annotation nhưng giải quyết bài toán khác nhau.

Chương tiếp theo tổng hợp toàn bộ cơ chế đã học để trả lời câu hỏi cuối cùng: **khi nào Annotation thực sự là lựa chọn phù hợp, và khi nào một API, interface hoặc cấu hình tường minh sẽ rõ ràng hơn?**
