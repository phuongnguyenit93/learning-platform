VM options là controls khởi động/configuration của JVM implementation. Chúng có thể chia conceptual thành:

- standard/portable launcher options ở mức Java toolchain;
- `-X...` non-standard nhưng phổ biến;
- `-XX:...` HotSpot-specific/advanced controls.

Không phải mọi flag tồn tại mãi hoặc có cùng semantics qua các JDK.

Rule vận hành:

1. biết option thuộc layer nào;
2. xác minh support trên JDK đang chạy;
3. ghi reason/SLO cho mỗi non-default flag;
4. đo trước và sau;
5. loại bỏ “cargo-cult flags” được copy từ hệ thống/JDK cũ.

Cấu hình JVM là code vận hành: cần versioning và bằng chứng.
