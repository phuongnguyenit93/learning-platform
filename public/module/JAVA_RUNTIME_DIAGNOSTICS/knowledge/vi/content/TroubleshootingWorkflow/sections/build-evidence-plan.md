Một kế hoạch thu thập bằng chứng nên viết được dưới dạng câu hỏi:

~~~text
Giả thuyết:
Request treo do thread contention.

Cần biết:
Các thread có lặp lại trạng thái BLOCKED trên cùng lock qua nhiều ảnh chụp không?

Bằng chứng:
3 thread dumps cách nhau 10 giây + JFR lock events.

Quyết định:
Nếu thread giữ lock và các stack bị block lặp lại → đi sâu concurrency.
Nếu không → kiểm tra I/O hoặc downstream latency.
~~~

Kế hoạch tốt có:

- giả thuyết hiện tại;
- dữ liệu cần thu;
- tác động dự kiến;
- thời điểm/số lần lấy;
- tiêu chí diễn giải;
- bước tiếp theo cho cả trường hợp giả thuyết đúng và sai.

Điều này biến troubleshooting thành quá trình có thể kiểm tra, thay vì chuỗi thao tác ngẫu nhiên.
