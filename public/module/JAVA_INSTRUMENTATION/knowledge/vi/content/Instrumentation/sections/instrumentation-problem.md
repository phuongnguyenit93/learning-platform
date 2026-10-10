Giả sử ta muốn đo thời gian của mọi lời gọi OrderService.placeOrder() trong nhiều ứng dụng đã build sẵn. Cách đơn giản nhất là sửa mã nguồn:

~~~java
public Order placeOrder(Request request) {
    long start = System.nanoTime();
    try {
        return doPlaceOrder(request);
    } finally {
        metrics.record(System.nanoTime() - start);
    }
}
~~~

Nhưng cách này không phù hợp khi ta đang xây profiler/APM agent, không sở hữu mã nguồn, hoặc cần áp dụng cùng một chính sách cho hàng nghìn class. Reflection có thể khám phá và gọi member ở runtime, còn proxy chỉ chặn được những lời gọi đi qua ranh giới proxy. Cả hai đều không cho ta một hook tổng quát vào **chuỗi định nghĩa class**.

Instrumentation giải quyết khoảng trống đó:

- logic được đóng gói trong agent thay vì rải vào ứng dụng;
- transformer có thể chọn class theo tên, loader hoặc module;
- probe có thể được chèn ngay lúc class được nạp;
- với khả năng phù hợp, class đã được nạp có thể được retransform/redefine.

Đổi lại, agent chạy rất gần JVM và có phạm vi tác động lớn. Một transformer sai có thể làm quá trình verification/linkage của class thất bại hoặc ảnh hưởng toàn ứng dụng. Vì vậy module này luôn học khả năng cùng với giới hạn và an toàn vận hành.
