Class histogram cho biết số instance và tổng size theo class trong heap tại thời điểm lấy.

Với jcmd:

~~~text
jcmd <pid> GC.class_histogram
~~~

Đừng hiểu “histogram” là một thao tác mặc định nhẹ. Trên Java 21, `jcmd` xếp `GC.class_histogram` là command có **High impact**, với chi phí phụ thuộc kích thước và nội dung heap. Trước khi lấy histogram — đặc biệt khi định lấy nhiều lần để so sánh — cần kiểm tra đúng JVM đích, thời điểm xảy ra triệu chứng và impact budget có thể chấp nhận.

Histogram hữu ích để:

- phát hiện class nào chiếm nhiều instance/bytes;
- so sánh nhiều ảnh chụp để xem class nào tăng;
- quyết định có cần heap dump sâu hơn không.

Nhưng histogram không cho đầy đủ object graph và đường dẫn giữ object. Một class lớn không có nghĩa nó bị leak; đó có thể là cache hợp lệ hoặc tập dữ liệu hiện tại.

Quy trình hợp lý:

~~~text
histogram t1
   ↓
histogram t2
   ↓
class nào tăng bất thường?
   ↓
heap dump / JFR / ngữ cảnh ứng dụng
~~~
