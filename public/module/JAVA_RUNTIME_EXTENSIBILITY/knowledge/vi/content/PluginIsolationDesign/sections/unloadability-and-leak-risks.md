“Unload plugin” trong JVM thực chất phụ thuộc vào việc **defining class loader trở nên unreachable** cùng toàn bộ class/object do nó giữ.

Không có API kiểu:

```java
Class.unload(); // không tồn tại
```

Một custom/plugin class loader có thể được GC khi không còn strong reference reachable tới loader, class hoặc object gắn với nó.

Các leak phổ biến:

- static field trong host giữ plugin instance;
- thread còn chạy với context class loader là plugin loader;
- global cache giữ `Class<?>` của plugin;
- listener chưa unregister;
- executor/thread chưa stop;
- JNI/native callback giữ reference.

Do đó unloadability phải được thiết kế từ đầu bằng lifecycle + ownership + reference cleanup.

Đừng dùng `ServiceLoader.reload()` như bằng chứng plugin đã unload; nó chỉ clear provider cache của loader đó.
