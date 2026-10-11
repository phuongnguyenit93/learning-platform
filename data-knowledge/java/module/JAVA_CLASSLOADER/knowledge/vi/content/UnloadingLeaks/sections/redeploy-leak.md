Giả sử phiên bản 1 được nạp:

```text
PluginLoaderV1
→ PaymentPlugin v1
```

Sau redeploy:

```text
PluginLoaderV2
→ PaymentPlugin v2
```

Nếu V1 còn bị giữ:

```text
application roots
├→ V1 listener/cache/thread/TCCL
│   ↓
│  PluginLoaderV1
│   ↓
│  toàn class graph v1
│
└→ PluginLoaderV2
    ↓
   class graph v2
```

Mỗi redeploy có thể tích lũy thêm thế hệ loader. Đây là lý do application server hoặc plugin host lâu ngày có thể tăng metaspace/heap dù object nghiệp vụ cũ tưởng như đã bị “xóa”.

Một trình tự shutdown thực tế nên dựa trên quyền sở hữu:

```text
1. ngừng nhận công việc mới cho plugin
2. dừng/join thread và executor do plugin sở hữu
3. gỡ đăng ký listener/provider/driver/callback đã đăng ký
4. xóa ThreadLocal và khôi phục TCCL
5. xóa các tham chiếu cache/registry do parent sở hữu
6. đóng resource/JAR handle của loader nếu loader hỗ trợ close
7. bỏ tham chiếu mạnh cuối cùng tới plugin instance/Class/loader
```

`URLClassLoader.close()` hữu ích để giải phóng resource JAR/file nhưng **không phải lệnh unload**. Nếu một cache toàn cục vẫn giữ `pluginClass`, loader vẫn reachable.
