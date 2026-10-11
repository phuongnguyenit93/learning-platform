Monitoring/APM agent thường instrument các ranh giới framework như:

~~~text
HTTP handler
client cơ sở dữ liệu
consumer nhận message
task định kỳ
thao tác nghiệp vụ đã chọn
~~~

Probe có thể ghi:

- thời điểm bắt đầu/kết thúc;
- trạng thái/lỗi;
- nhóm endpoint/query;
- metadata tương quan request;
- counter/histogram.

Event logging cũng có thể chèn hook ở những điểm ứng dụng chưa phát event.

Điểm thiết kế quan trọng là **cardinality và quyền riêng tư**. Instrumentation có thể nhìn tham số/giá trị trả về nhưng không có nghĩa nên thu thập tất cả. Agent cần chính sách tránh bí mật/PII và tránh label có cardinality cao.

Monitoring agent tốt làm ứng dụng dễ quan sát hơn với overhead và ranh giới có kiểm soát, không biến mọi method thành một câu lệnh log.
