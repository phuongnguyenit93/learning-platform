Runtime phải giữ metadata cho loaded classes: type information, method/field structures và dữ liệu liên quan tới class lifecycle.

HotSpot hiện đại thường dùng **Metaspace** cho phần lớn class metadata và lấy memory từ native memory, không phải Java heap.

Hệ quả practical:

- load rất nhiều distinct classes/class loaders có thể tăng native memory;
- unloading phụ thuộc class-loader reachability/lifecycle;
- heap bình thường không loại trừ class-metadata pressure.

Chi tiết ClassLoader leak thuộc ClassLoader/Diagnostics. Module JVM chỉ giúp người học biết class metadata là một nguồn tiêu thụ bộ nhớ ngoài heap.
