Dependency conflict xảy ra khi plugin và host/plugin khác cần version incompatible của cùng library.

Ví dụ:

```text
host → library X 1.x
plugin A → library X 1.x
plugin B → library X 2.x
```

Nếu tất cả cùng một class loader, runtime chỉ resolve một class definition theo loader/class-path rules; plugin có thể gặp `NoSuchMethodError`, `NoClassDefFoundError` hoặc hành vi sai.

Các hướng xử lý:

- align dependency version toàn hệ thống;
- shade/relocate library private;
- isolate plugin bằng loader riêng;
- đưa shared API ra contract module tối thiểu;
- tránh truyền type của thư viện private qua ranh giới plugin.

Cô lập không tự động giải quyết mọi conflict: type cần trao đổi qua ranh giới vẫn phải có identity tương thích.

Dependency conflict là lý do kiến trúc plugin phải thiết kế chính sách shared/private dependency từ đầu, không đợi tới lỗi production mới thêm custom class loader.
