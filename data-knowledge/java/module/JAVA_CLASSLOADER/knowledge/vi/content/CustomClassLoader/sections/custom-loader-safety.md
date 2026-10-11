Custom loading dễ tạo lỗi vì class definition có state. Một loader phải tránh race:

```text
Thread A load PaymentPlugin
Thread B load PaymentPlugin cùng lúc
→ không được define cùng binary name hai lần trong cùng loader
```

`ClassLoader.loadClass` mặc định sử dụng class-loading lock phù hợp. Đây là thêm một lý do để giữ `loadClass` mặc định khi chỉ cần custom `findClass`.

> **Nâng cao — có thể bỏ qua ở lượt học đầu:** nếu xây loader có parallel loading phức tạp, `ClassLoader.registerAsParallelCapable()` tồn tại cho subclass hierarchy đáp ứng contract tương ứng. Đây là tối ưu và thiết kế nâng cao, không phải bước bắt buộc cho custom loader cơ bản.

Package cũng có constraint. Các class trong cùng package runtime có liên hệ với package metadata, signer/certificate constraints và module/package access rules. Custom loader không nên coi việc ghép một binary name tùy ý với byte array là hoàn toàn tự do.

> **Nâng cao — production loader:** `defineClass` còn có overload nhận `ProtectionDomain`; signed JAR/package certificate/sealing rules có thể ảnh hưởng cách class được định nghĩa an toàn. Module này chỉ cần biết ranh giới đó tồn tại, không học sâu security domain/sealing.

Đặc biệt, **cùng tên package trong source chưa đủ để hai class thuộc cùng runtime package**. Runtime package identity còn phụ thuộc defining ClassLoader. Vì vậy:

```text
demo.internal.First  — defined by loader A
demo.internal.Second — defined by loader B

cùng textual package name
+ defining loader khác
→ runtime package khác
→ không được package-private access lẫn nhau chỉ vì cùng tên package
```

Đây là lý do các class cần cộng tác qua package-private member thường phải nằm trong cùng loader/package boundary đã được thiết kế, thay vì bị chia tùy ý qua nhiều custom loader.

Một ranh giới khác là namespace nền tảng:

```text
java.*
→ custom ClassLoader.defineClass không được phép chiếm
```

### Dọn dẹp là một phần của thiết kế

Nếu loader đọc JAR/resource có handle cần đóng, lifecycle plugin phải có bước dọn dẹp tương ứng. Ví dụ khi dùng `URLClassLoader`:

```java
try (var loader = new java.net.URLClassLoader(urls, parent)) {
    Class<?> pluginType = loader.loadClass(pluginName);
    // dùng plugin
}
```

`close()` giải phóng resource mà loader đang giữ; nó **không ép class unload ngay**. Unloading còn phụ thuộc reachability và GC, sẽ được học ở chương cuối.

Danh sách kiểm tra thực tế cho custom loader:

```text
1. Có thật sự cần nguồn tùy chỉnh hoặc tách biệt namespace?
2. API dùng chung nằm ở parent nào?
3. Có thể chỉ override findClass không?
4. Loader có define cùng name an toàn khi concurrent không?
5. Resource/JAR handle được đóng lúc plugin dừng chưa?
6. Có reference dài hạn giữ loader sau khi dừng không?
```

Sau khi một custom loader định nghĩa class, câu hỏi khó tiếp theo xuất hiện: **hai class cùng tên nhưng do hai loader khác nhau định nghĩa có phải cùng type không?**
