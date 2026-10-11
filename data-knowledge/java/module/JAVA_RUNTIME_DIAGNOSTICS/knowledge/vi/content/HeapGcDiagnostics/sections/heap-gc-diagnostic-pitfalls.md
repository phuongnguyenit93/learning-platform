Các bẫy phổ biến:

**Heap usage cao = leak**  
Heap được phép dùng gần giới hạn nếu GC reclaim tốt.

**Allocation rate cao = leak**  
Cấp phát và việc giữ object sống là hai chuyện khác nhau.

**Một heap dump = nguyên nhân gốc**  
Dump cần ngữ cảnh, xu hướng và workload.

**Histogram top class = culprit**  
Class đứng đầu có thể chỉ là dữ liệu hợp lệ.

**Chỉ nhìn used trước GC**  
Post-GC live set thường hữu ích hơn cho retention trend.

**Bỏ qua native memory**  
RSS của tiến trình tăng không nhất thiết do Java heap.

**Heap dump không có rủi ro**  
Dump có thể rất lớn, tạo pause và chứa dữ liệu nhạy cảm.

Chẩn đoán heap/GC tốt luôn kết hợp ảnh chụp + xu hướng + ngữ cảnh runtime.
