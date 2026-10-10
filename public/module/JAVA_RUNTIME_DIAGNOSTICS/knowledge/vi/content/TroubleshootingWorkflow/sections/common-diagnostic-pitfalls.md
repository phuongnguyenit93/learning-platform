Các lỗi suy luận phổ biến:

**Một ảnh chụp = một kết luận**  
Một thread đang RUNNABLE hoặc một object type lớn chưa chứng minh nguyên nhân gốc. Cần xu hướng và đối chiếu nhiều nguồn.

**Metric thay cho cơ chế**  
CPU 90% cho biết mức sử dụng, không cho biết code path. Heap 80% không tự nói có leak.

**Chỉ tìm bằng chứng ủng hộ giả thuyết**  
Mỗi kế hoạch phải có điều kiện bác bỏ.

**Dùng công cụ nặng quá sớm**  
Heap/core dump có thể làm sự cố tệ hơn và tạo file rất lớn.

**Không ghi time/PID/version**  
Dữ liệu đúng loại nhưng sai tiến trình/khoảng thời gian dẫn tới phân tích sai.

**Restart rồi mới nghĩ đến bằng chứng**  
Nhiều trạng thái runtime không thể phục dựng sau restart.

**Nhầm ranh giới**  
Diagnostics quan sát và khoanh vùng; không cần dạy lại GC algorithm, JMM, JNI hoặc instrumentation internals.
