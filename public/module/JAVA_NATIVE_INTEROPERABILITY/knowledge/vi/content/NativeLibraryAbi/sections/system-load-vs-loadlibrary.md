System.load và System.loadLibrary đều yêu cầu JVM load native library, nhưng input của chúng khác nhau.

- **System.load(path)** nhận một filename tuyệt đối. Ứng dụng tự quyết định chính xác file nào được load.
- **System.loadLibrary(name)** nhận library name, không phải đường dẫn đầy đủ. JVM/OS mapping tên đó sang tên file native phù hợp và tìm theo cơ chế library search của runtime/platform.

Ví dụ:

~~~java
System.loadLibrary("imagecodec");

Path lib = Path.of("native", "imagecodec.dll")
        .toAbsolutePath();
System.load(lib.toString());
~~~

System.loadLibrary phù hợp khi cách đóng gói và đường dẫn tìm kiếm đã được kiểm soát. System.load hữu ích khi ứng dụng chủ động xác định artifact theo nền tảng hoặc vị trí cụ thể.

Cả hai đều có thể ném UnsatisfiedLinkError khi library không thể load hoặc liên kết. Lỗi này không chỉ có nghĩa “file không tồn tại”; sai kiến trúc CPU hoặc dependency native thiếu cũng có thể là nguyên nhân.
