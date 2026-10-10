Khi define layer, module phải được map sang class loader.

Java cung cấp ba hướng chính:

```text
defineModulesWithOneLoader
→ tất cả module trong configuration dùng một loader mới

defineModulesWithManyLoaders
→ mỗi module có loader riêng

defineModules
→ ứng dụng cung cấp function module-name → ClassLoader
```

One-loader đơn giản và phù hợp khi module set tin cậy nhau và không cần dependency isolation mạnh.

Many-loaders tăng mức cô lập nhưng tạo nhiều ranh giới class loader hơn; object/type đi qua ranh giới module vẫn phải tuân readability và shared type identity tương ứng.

Custom mapping dành cho kiến trúc đặc biệt và kéo theo trách nhiệm lớn hơn về trạng thái sẵn sàng và delegation của loader.

Với `defineModules(Configuration, Function<String, ClassLoader>)`, ứng dụng phải bảo đảm các loader:

- tôn trọng module readability khi delegation;
- nên là parallel-capable để giảm nguy cơ deadlock trong class loading;
- đã sẵn sàng load class/resource của module trước khi layer được sử dụng.

API cũng không bảo đảm việc tạo layer bằng custom mapping là atomic trong mọi cách triển khai: thao tác có thể thất bại sau khi một phần module đã được define vào JVM. Vì vậy đây là công cụ dành cho trường hợp thật sự cần custom loader topology, không phải lựa chọn mặc định cho plugin system.

Không chọn many-loaders chỉ vì “nhiều plugin”. Yêu cầu cô lập, dependency conflict và chiến lược unload/replacement mới là đầu vào chính.
