Module này dừng ở **Java ↔ native boundary** và chủ động handoff các chủ đề sâu hơn cho module sở hữu phù hợp.

- **JVM**: runtime internals, native-memory internals của JVM, execution engine.
- **Dynamic Runtime**: MethodHandle/VarHandle mechanics, adaptation và typed invocation chi tiết.
- **Java Version / Java 22 FFM**: lịch sử thay đổi và finalization của FFM theo từng release.
- **Ngoài Java curriculum**: C/C++ language, compiler/linker toolchain và platform-specific ABI engineering chuyên sâu.
- **Infrastructure/runtime**: quản trị process/OS nói chung.

Ở đây người học chỉ cần đủ kiến thức các boundary trên để thiết kế native integration đúng. Ví dụ ta dùng MethodHandle như kết quả của Linker nhưng không học lại toàn bộ combinator; ta biết Java 22 final hóa FFM nhưng baseline thực hành vẫn là Java 21 preview.

Checkpoint cuối module: có thể giải thích từ lúc Java chọn/load native library, mô tả data/function contract, quản lý memory/callback lifetime, gọi qua JNI hoặc FFM, cho tới khi lỗi và tài nguyên được xử lý an toàn.
