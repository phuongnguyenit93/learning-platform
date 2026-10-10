Đối với class do ClassLoader do ứng dụng tạo ra định nghĩa, điều kiện cốt lõi là **ClassLoader định nghĩa phải trở nên có thể được GC thu hồi**. Một class như vậy không thể trở thành đối tượng để gỡ nạp khi ClassLoader định nghĩa của nó vẫn còn được tham chiếu và chưa thể được thu hồi.

Mô hình tư duy:

```text
reachable PluginClassLoader
→ classes do loader định nghĩa vẫn thuộc loader namespace đó
→ chưa có điều kiện để unload namespace

PluginClassLoader unreachable
→ loader có thể được GC
→ classes do loader định nghĩa có thể được unload
```

Các class do Bootstrap ClassLoader định nghĩa không có vòng đời kiểu ClassLoader plugin và không phải đối tượng để ứng dụng chủ động gỡ nạp.

### Vì sao class của ứng dụng thông thường gần như sống tới khi JVM kết thúc?

Trong một ứng dụng Java thông thường, Application/System ClassLoader là hạ tầng sống rất lâu, thường gần bằng vòng đời của tiến trình JVM. Vì ClassLoader này vẫn còn được tham chiếu, những class mà nó định nghĩa **thường không có vòng đời “nạp rồi gỡ nạp riêng từng class”** giống plugin.

```text
JVM process đang chạy
→ Application/System ClassLoader vẫn sống
→ application classes do nó định nghĩa thường vẫn thuộc loader namespace đang sống
→ không mong đợi từng class tự biến mất chỉ vì không còn instance
```

Việc gỡ nạp class trở nên đặc biệt quan trọng khi ta cố tình tạo **ranh giới ClassLoader có thể bỏ đi sau một vòng đời**:

```text
plugin loader
application-server deployment loader
hot-reload/devtools loader
isolated scripting/tooling loader
```

Ở các mô hình đó, ta muốn bỏ cả một thế hệ ClassLoader để toàn bộ không gian tên cũ có cơ hội được thu hồi. Đây là lý do chương này tập trung vào plugin/triển khai lại thay vì coi việc gỡ nạp là vòng đời bình thường của mọi class trong ứng dụng.

### “Có thể gỡ nạp” không có nghĩa “sẽ gỡ nạp ngay”

GC và việc gỡ nạp class phụ thuộc cách triển khai JVM, bộ thu gom rác, áp lực heap và thời điểm chạy. Ứng dụng không có API:

```java
// không tồn tại
Class.unloadNow(PaymentPlugin.class);
```

Ngay cả `System.gc()` chỉ là một yêu cầu/gợi ý cho GC, không phải hợp đồng đảm bảo một ClassLoader sẽ được thu hồi tại dòng mã kế tiếp.
