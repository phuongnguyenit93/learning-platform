Java 21 đánh dấu một số FFM operation là **restricted** vì chúng có thể làm JVM crash hoặc gây silent memory corruption khi contract bị mô tả sai. Ví dụ gồm tạo foreign call/upcall boundary, load library qua libraryLookup và reinterpret segment trong các trường hợp cho phép thay đổi giả định về spatial/temporal bounds.

Đây là vấn đề tách biệt với preview:

~~~text
--enable-preview
→ cho phép dùng preview API của Java 21

--enable-native-access=<module>
→ khai báo module được cấp native access để restricted operation chạy không phát warning
~~~

Trong Java 21, nếu không truyền `--enable-native-access`, restricted operation vẫn được phép chạy nhưng runtime phát warning. Nếu đã truyền option này, native access chỉ được cấp cho các module được liệt kê; restricted call từ bên gọi không có native access bị từ chối bằng `IllegalCallerException`. Code chạy trên class path có thể dùng `ALL-UNNAMED` để khai báo native access và tránh warning:

~~~bash
java --enable-preview \
     --enable-native-access=ALL-UNNAMED \
     NativeDemo
~~~

Không nên bật native access rộng chỉ để “hết cảnh báo”. Tùy chọn này nên phản ánh một ranh giới tin cậy có chủ đích: module nào thật sự cần thực hiện restricted operation thì module đó mới nên được khai báo native access.

Từ overview này, các abstraction FFM sẽ được tách ra theo trách nhiệm. Chương tiếp theo bắt đầu với MemorySegment, vì Java cần mô hình một vùng memory có bounds trước khi có thể lập luận chính xác về lifetime, layout và foreign call.
