Trước khi chọn công cụ, hãy phân loại triệu chứng ở mức đủ rộng:

| Triệu chứng | Hướng bằng chứng đầu tiên |
| --- | --- |
| request treo / không tiến triển | thread dump, JFR thread/lock events |
| CPU cao | thread dump lặp, JFR CPU samples |
| Java heap tăng | GC log, histogram, bằng chứng heap/JFR |
| RSS tăng nhưng heap ổn | NMT, góc nhìn bộ nhớ từ OS, chuyển sang native nếu cần |
| latency spike ngắn | dòng thời gian JFR, đối chiếu log ứng dụng |
| JVM crash | hs_err, core, JFR/log trước crash |
| cần quan sát trạng thái từ xa | MXBeans/JMX |

Đây không phải bảng tra cứu tuyệt đối. Một triệu chứng có thể có nhiều nguyên nhân. Mục tiêu của bước phân loại chỉ là chọn **nhóm bằng chứng đầu tiên** có khả năng phân biệt nguyên nhân tốt với chi phí thấp.

Luôn ghi lại khoảng thời gian, host/container, PID, phiên bản runtime và thay đổi gần nhất. Bằng chứng chẩn đoán từ sai tiến trình hoặc sai thời điểm gần như vô giá trị.
