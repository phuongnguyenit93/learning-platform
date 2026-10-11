Các bẫy thường gặp:

1. **Host require/import provider trực tiếp** → mất decoupling.
2. **Dùng thứ tự discovery làm priority** → hành vi phụ thuộc topology triển khai.
3. **Provider constructor làm công việc nặng** → discovery gây side effect khó kiểm soát.
4. **Không định nghĩa chính sách khi thiếu provider** → feature fail muộn.
5. **Share quá nhiều dependency** → version conflict.
6. **Load riêng contract ở từng plugin loader** → type identity mismatch.
7. **Gọi `reload()` rồi nghĩ class đã unload** → rò rỉ tài nguyên/class loader.
8. **Không cleanup thread/ThreadLocal/listener** → old plugin generation không collectible.
9. **SPI evolve không contract-test provider cũ** → incompatibility chỉ lộ ở deploy.
10. **ModuleLayer nhưng vẫn hard-code provider modules trong host** → architecture phức tạp nhưng không đạt extensibility.

Một lượt review thiết kế tốt nên đặt các câu hỏi trên trước khi phần triển khai trở nên lớn và khó đổi.
