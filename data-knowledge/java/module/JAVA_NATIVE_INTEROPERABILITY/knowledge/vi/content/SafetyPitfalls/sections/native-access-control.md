Java 21 có **hai cổng độc lập** cần phân biệt.

Thứ nhất, FFM là preview API nên compile/run cần bật preview:

~~~bash
javac --release 21 --enable-preview NativeDemo.java
java --enable-preview NativeDemo
~~~

Thứ hai, một số FFM method là **restricted operation** vì có thể thực thi native code hoặc làm thay đổi giả định an toàn. Trong Java 21, nếu hoàn toàn không truyền `--enable-native-access`, runtime vẫn cho phép restricted call nhưng phát warning. Khi option này đã được truyền, chỉ các module được liệt kê mới có native access; restricted call từ bên gọi không được cấp quyền bị từ chối bằng `IllegalCallerException`. Có thể khai báo native access cho code trên class path bằng `ALL-UNNAMED`:

~~~bash
java --enable-preview \
     --enable-native-access=ALL-UNNAMED \
     NativeDemo
~~~

Không nên diễn giải `--enable-native-access` là “cờ bật FFM”. Nhiều API FFM an toàn không đi qua restricted boundary; còn việc khai báo native access nên được xem như một ranh giới tin cậy có chủ đích cho code gọi restricted operation.

Khi ứng dụng dùng named module, nên cấp native access cho đúng module cần nó thay vì mở rộng không cần thiết.
