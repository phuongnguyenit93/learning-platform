Các trường hợp sử dụng thường gặp có thể chia thành bốn nhóm:

| Nhóm | Instrumentation thường làm gì? |
| --- | --- |
| Profiling | chèn timing/counter để đo method hoặc event liên quan cấp phát |
| Coverage | ghi nhận block/line/method nào đã được thực thi |
| Monitoring / APM | chèn probe quanh HTTP, database, messaging hoặc ranh giới nghiệp vụ |
| Event logging / tracing | phát event hoặc hook truyền ngữ cảnh mà ứng dụng không phải tự viết |

Một agent cũng có thể dùng redefine/retransform cho gỡ lỗi hoặc công cụ runtime. Tuy nhiên “có thể sửa bytecode” không đồng nghĩa “nên sửa hành vi nghiệp vụ tùy ý”. Java SE mô tả các công cụ instrumentation lành tính chủ yếu bổ sung logic quan sát thay vì thay đổi trạng thái/ngữ nghĩa của ứng dụng.

Điểm phân ranh giới:

- **Instrumentation** sở hữu cách chèn/biến đổi code và vòng đời của agent.
- **Runtime Diagnostics** sở hữu cách diễn giải thread dump, heap dump, JFR, bằng chứng GC và quy trình tìm nguyên nhân.

Một profiler có thể dùng Instrumentation để thu dữ liệu, nhưng việc biến dữ liệu đó thành kết luận chẩn đoán là lớp trách nhiệm khác.
