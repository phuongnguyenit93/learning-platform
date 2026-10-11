Ở mức khái niệm, `ClassLoader.loadClass(name)` hoạt động gần như:

```text
1. Class này đã được loader này load chưa?
   → có: dùng lại

2. Có parent?
   → có: nhờ parent load
   → không: thử bootstrap loading

3. Parent/bootstrap không tìm thấy?
   → loader hiện tại gọi findClass(...)
```

Contract thực tế của `ClassLoader#loadClass(String, boolean)` còn quản lý locking và optional resolution. Tham số `resolve=true` có nghĩa loader sẽ gọi `resolveClass(...)` cho class vừa load trước khi trả về; `resolveClass` nối trực tiếp với **linking/resolution** đã học ở chương Lifecycle, không phải initialization.

```text
loadClass(name, false)
→ tìm/load class
→ không yêu cầu resolveClass ngay tại API call này

loadClass(name, true)
→ tìm/load class
→ resolveClass(class)

resolveClass
≠ initialize class
```

Trong code ứng dụng thông thường, ta hiếm khi cần tự gọi `resolveClass`. Điều quan trọng là hiểu “resolve” trong ClassLoader API **không có nghĩa chạy static initializer**.

Ở chương này, chỉ cần giữ flow ở mức policy:

```text
loadClass(name)
→ kiểm tra class đã load chưa
→ hỏi parent trước
→ parent không có thì loader hiện tại mới thử nguồn riêng
```

Chương `CustomClassLoader` ngay sau đây sẽ dạy `findClass`, `defineClass` và code subclass cụ thể. Việc tách như vậy giúp ta hiểu **vì sao delegation tồn tại** trước khi học **cách tự viết loader**.
