Bằng chứng chẩn đoán không chỉ khác nhau về thông tin mà còn khác nhau về **chi phí thu thập** và mức độ chúng có thể làm thay đổi chính hệ thống đang quan sát.

Có thể hình dung theo một phổ:

```text
thông tin tiến trình / flags
        ↓
counter / log / lightweight event
        ↓
thread dump
        ↓
class histogram
        ↓
heap dump hoặc dữ liệu chẩn đoán rất lớn

thường nhẹ hơn -------------------- thường nặng hơn
```

Thứ tự này chỉ là mô hình tư duy; tác động thực tế phụ thuộc JVM, số thread, kích thước heap, collector, tải hệ thống và lệnh cụ thể. Chính `jcmd <pid> help <command>` cũng hiển thị mức tác động cho nhiều lệnh chẩn đoán.

Khi đánh giá một nguồn dữ liệu, hãy hỏi:

- **Nó trả lời câu hỏi gì?** Thread dump mạnh về execution/locks nhưng không cho biết object nào giữ phần lớn heap.
- **Ảnh chụp hay dòng thời gian?** Một histogram là ảnh chụp; GC log và JFR cung cấp chuỗi sự kiện theo thời gian.
- **Có thể làm JVM dừng hoặc tiêu tốn tài nguyên đáng kể không?** Một số thao tác heap có thể cần safepoint hoặc full GC, heap dump còn tạo I/O rất lớn.
- **Có đủ chỗ lưu dữ liệu chẩn đoán không?** Heap dump có thể gần bằng kích thước live heap hoặc lớn hơn kỳ vọng vận hành.
- **Quan sát có làm lệch hành vi không?** Khi hệ thống đang sát giới hạn CPU/I/O, một thao tác nặng có thể làm sự cố trầm trọng thêm.

Chất lượng bằng chứng cũng quan trọng. Một ảnh chụp đúng nhưng lấy sau khi restart có thể vô dụng vì trạng thái gây lỗi đã mất. Một log liên tục có thể giá trị hơn dữ liệu rất chi tiết nhưng được thu thập sai thời điểm.

Nguyên tắc thực tế là bắt đầu bằng dữ liệu ít xâm lấn có khả năng phân biệt các giả thuyết, sau đó tăng độ sâu khi cần. “Nhiều dữ liệu hơn” không tự động đồng nghĩa với “bằng chứng tốt hơn”.
