`reload()` làm đúng một việc cốt lõi:

```text
clear provider cache của ServiceLoader instance
```

Sau đó iteration/stream tiếp theo sẽ discovery lại từ đầu theo context của loader.

```java
ServiceLoader<ReportExporter> loader =
        ServiceLoader.load(ReportExporter.class);

// ... provider được sử dụng
loader.reload();
```

`reload()` **không**:

- gọi lifecycle `stop()` của provider cũ;
- đóng tài nguyên provider đang giữ;
- unload class;
- unload module;
- bảo đảm JAR cũ có thể xóa;
- biến plugin architecture thành hot-reload system.

Iterator/stream cũ cũng không nên tiếp tục dùng sau khi cache bị reload; chúng có hành vi fail-fast khi cache bị thay đổi.

Ngoài ra, một `ServiceLoader` instance **không thread-safe**. Nếu nhiều thread cần discovery, host phải tự đồng bộ hoặc thiết kế loader ownership phù hợp.

Plugin reload thực sự cần vòng đời + dọn dẹp tài nguyên + thay loader/layer. `ServiceLoader.reload()` chỉ là một primitive nhỏ của discovery cache trong luồng đó.
