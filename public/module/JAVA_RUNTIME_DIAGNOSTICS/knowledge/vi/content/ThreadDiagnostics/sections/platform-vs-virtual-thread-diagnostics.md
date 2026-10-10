Java 21 có hai loại thread cần phân biệt về observability:

**Platform threads**  
Được `ThreadMXBean` quản lý/quan sát. Thread dump truyền thống và `jcmd Thread.print` phù hợp với số lượng platform thread thông thường.

**Virtual threads**  
Có thể tồn tại với số lượng rất lớn. Trong Java 21, `ThreadMXBean` **không** giám sát hoặc quản lý virtual thread.

Để dump cả platform và virtual threads:

~~~text
jcmd <pid> Thread.dump_to_file -format=text threads.txt
jcmd <pid> Thread.dump_to_file -format=json threads.json
~~~

Oracle lưu ý định dạng dump này không chứa đầy đủ mọi thông tin của thread dump truyền thống như địa chỉ object và một số thông tin lock/JNI/heap.

JFR bổ sung event quan trọng cho virtual threads, đặc biệt VirtualThreadPinned và VirtualThreadSubmitFailed. Vì vậy với ứng dụng dùng virtual thread nhiều, thread dump + JFR thường bổ sung cho nhau.
