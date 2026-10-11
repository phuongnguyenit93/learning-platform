Profiler cần đo hành vi runtime mà không yêu cầu ứng dụng tự thêm code đo thời gian vào từng method.

Một agent có thể:

~~~text
khớp OrderService.placeOrder
→ chèn timestamp ở điểm vào method
→ ghi thời lượng ở đường thoát bình thường/exception
→ gửi sample/counter tới runtime của profiler
~~~

Điểm cần cân bằng là overhead. Instrument mọi method bằng bộ đếm thời gian độ phân giải cao có thể làm thay đổi chính hành vi ta muốn đo.

Profiler thực tế thường:

- chọn một tập con method/package;
- sampling hoặc tổng hợp thay vì ghi từng event chi tiết;
- tránh cấp phát trên đường thực thi nóng (hot path);
- dùng helper runtime tối ưu;
- cho phép bật/tắt probe động.

Instrumentation giải quyết phần **chèn probe**; cách profiler thống kê, trực quan hóa và phân tích hiệu năng thuộc một miền rộng hơn.
