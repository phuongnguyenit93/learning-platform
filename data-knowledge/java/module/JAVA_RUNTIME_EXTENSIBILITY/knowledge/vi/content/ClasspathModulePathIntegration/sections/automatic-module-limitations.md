Automatic module là JAR không có explicit `module-info.class` nhưng được đặt trên module path và được JPMS coi như named module tự động.

Với service provider, automatic module có giới hạn quan trọng:

```text
provider()
→ không được hỗ trợ như explicit module provider

provider constructor
→ bắt buộc
```

Do đó class provider phải trực tiếp phù hợp với service type và có public no-arg constructor.

Điều này ảnh hưởng migration strategy: một provider JAR đang dùng `META-INF/services` trên class path có thể chạy như automatic module trên module path, nhưng không có toàn bộ expressiveness của explicit module descriptor.

Nếu architecture cần `provides` rõ ràng, strong encapsulation hoặc static `provider()` factory method, hãy chuyển provider thành explicit named module thay vì dừng ở automatic module.
