Thread dump, heap histogram hay NMT summary đều là những ảnh chụp tại một thời điểm. Chúng rất hữu ích nhưng dễ bỏ lỡ vấn đề chỉ xuất hiện trong vài giây hoặc cần hiểu **chuỗi sự kiện trước–trong–sau**.

Java Flight Recorder (JFR) là cơ chế ghi sự kiện tích hợp trong JDK/HotSpot. Nó thu thập dữ liệu runtime và ứng dụng theo dòng thời gian với chi phí được thiết kế đủ thấp cho nhiều kịch bản trên môi trường production.

JFR phù hợp khi cần trả lời:

- CPU spike đến từ chuỗi lời gọi nào?
- lock contention xảy ra trước latency spike ra sao?
- allocation tăng vào lúc nào?
- GC, I/O và hoạt động thread có liên quan trong cùng khoảng thời gian không?
- virtual thread có bị pinned hoặc submit failed không?

Mental model:

~~~text
công cụ ảnh chụp
→ trạng thái tại một thời điểm

JFR
→ chuỗi event có timestamp + thời lượng + ngữ cảnh + stack (khi event bật)
~~~

JFR không tự “chẩn đoán nguyên nhân gốc”; nó cung cấp dòng thời gian giàu ngữ cảnh để kiểm tra giả thuyết.
