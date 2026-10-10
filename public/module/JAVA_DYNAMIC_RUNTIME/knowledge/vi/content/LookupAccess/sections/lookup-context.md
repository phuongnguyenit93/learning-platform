Các thao tác factory/context sau có vai trò khác nhau:

- `MethodHandles.lookup()`: lookup gắn với class của bên gọi;
- `MethodHandles.publicLookup()`: lookup hạn chế cho public access;
- `lookup.in(Target.class)`: chuyển lookup class sang target nhưng quyền chỉ có thể giữ nguyên hoặc giảm;
- `MethodHandles.privateLookupIn(Target.class, lookup)`: tạo lookup có private access vào target khi lookup đầu vào có đủ `MODULE` + `PRIVATE` và quan hệ module/package cho phép.

Ví dụ:

```java
MethodHandles.Lookup callerLookup = MethodHandles.lookup();

MethodHandles.Lookup targetLookup =
        MethodHandles.privateLookupIn(
                Target.class,
                callerLookup
        );
```

`privateLookupIn` không phải “bypass private”. Với target ở module khác, module của lookup phải đọc module target và package chứa target phải được `opens` phù hợp; lookup kết quả dùng target làm lookup class, giữ class nguồn làm `previousLookupClass()` và mất `MODULE` access khi chuyển qua module.

Khi framework phải truy cập member không public, đây là nơi nên phân tích quyền trước khi nghĩ tới giải pháp vòng bằng JVM flags hoặc mở module quá rộng.
