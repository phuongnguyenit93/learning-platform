Một ảnh chụp lớn chưa chứng minh leak. Leak là vấn đề **object bị giữ lại theo thời gian**.

So sánh:

~~~text
t1 post-GC heap = 500 MB
t2 post-GC heap = 700 MB
t3 post-GC heap = 950 MB
~~~

Nếu workload tương đương mà live set tăng đều, cần điều tra thêm.

Xu hướng có thể lấy từ:

- GC logs;
- JMX/MXBeans;
- JFR;
- repeated histograms;
- monitoring metrics.

Các nguồn trên không có cùng chi phí thu thập. Đặc biệt, lặp lại `GC.class_histogram` vẫn là lặp lại một command được xếp **High impact** tùy heap size/content. Chỉ dùng repeated histogram khi giá trị chẩn đoán xứng đáng với chi phí đó; nếu không, ưu tiên dữ liệu theo thời gian ít xâm lấn hơn như GC log đã có, JFR, management data hoặc monitoring metrics.

Heap dump cho object graph chi tiết nhưng chỉ là một thời điểm. Hai dump cách nhau có thể mạnh hơn một dump đơn lẻ, nhưng chi phí cũng lớn hơn.

Luôn đối chiếu xu hướng với workload, lần deploy và traffic. Dữ liệu tăng hợp lệ không phải leak.
