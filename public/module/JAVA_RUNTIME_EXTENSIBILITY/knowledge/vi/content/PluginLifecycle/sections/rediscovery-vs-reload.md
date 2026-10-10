Ba khái niệm dễ bị trộn:

```text
rediscovery
→ tìm lại provider từ runtime environment

ServiceLoader.reload()
→ clear cache của một ServiceLoader rồi discovery lại

plugin reload
→ deactivate old plugin + release resources + load/activate replacement
```

`ServiceLoader.reload()` chỉ thực hiện phần giữa rất nhỏ. Nó không shutdown provider cũ và không làm JVM unload class.

Nếu plugin set thay đổi bằng JAR/class-loader mới, host có thể cần tạo discovery context mới. Với modular plugin, thường cần `Configuration`/`ModuleLayer` mới.

Hot reload là capability architecture riêng và phải test các race:

- request đang dùng old plugin;
- new plugin activation fail;
- old plugin cleanup chậm;
- reference cũ còn bị giữ.

Nếu không có requirement rõ cho hot reload, restart process thường đơn giản và an toàn hơn.
