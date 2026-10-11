Khi một lớp cần được khởi tạo, lớp cha được khởi tạo trước nếu cần, sau đó phần khởi tạo trường `static` và khối `static` của lớp chạy theo thứ tự xuất hiện trong mã nguồn.

```text
lớp cha được khởi tạo nếu cần
        ↓
trường/khối static của lớp con theo thứ tự trong mã nguồn
```

Chi tiết về nạp lớp, liên kết và khởi tạo ở mức JVM thuộc mô-đun `classloader`; ở đây chỉ cần mô hình tư duy về thời điểm trạng thái `static` trở nên sẵn sàng.
