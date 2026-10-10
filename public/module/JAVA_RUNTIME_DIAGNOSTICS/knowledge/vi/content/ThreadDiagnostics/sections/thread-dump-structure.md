Thread dump truyền thống thường gồm một khối cho mỗi platform thread: tên, id, trạng thái, stack frame và các chú thích lock/monitor.

Ví dụ rút gọn:

~~~text
"worker-1" #31 ... RUNNABLE
   java.lang.Thread.State: RUNNABLE
        at com.example.OrderService.calculate(OrderService.java:84)
        at ...
~~~

Với monitor, có thể thấy annotation dạng conceptual:

~~~text
- waiting to lock <0x...>
- locked <0x...>
- waiting on <0x...>
~~~

Đọc theo thứ tự:

1. xác định tên/id của thread có liên quan workload không;
2. xem trạng thái;
3. đọc vài frame trên cùng — nơi thread đang ở;
4. tìm quan hệ lock/monitor;
5. so với các thread khác và các ảnh chụp trạng thái khác.

Một stack frame cho biết **nơi thread được quan sát**, không chứng minh frame đó là nguyên nhân gốc.
