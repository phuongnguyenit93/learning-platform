Sau khi library đã load, runtime cần tìm **symbol** đại diện cho function hoặc dữ liệu native.

Với JNI, native method có thể được resolve theo naming convention của JNI hoặc được liên kết chủ động bằng RegisterNatives. Với FFM, SymbolLookup.find nhận symbol name và trả về address nếu tìm thấy; address đó sau đó được Linker dùng để tạo downcall.

Điều này tạo ra hai loại lỗi khác nhau:

- **lỗi phân giải library**: binary chưa load được;
- **lỗi phân giải symbol**: library đã có nhưng symbol mong đợi không tồn tại hoặc không được export dưới tên đó.

Symbol name là contract ở binary level. C++ name mangling, build flags, visibility/export rule hoặc version khác của native library có thể làm symbol name thay đổi. Vì thế header/source-level name không đảm bảo rằng binary export đúng symbol mà Java đang tìm.
