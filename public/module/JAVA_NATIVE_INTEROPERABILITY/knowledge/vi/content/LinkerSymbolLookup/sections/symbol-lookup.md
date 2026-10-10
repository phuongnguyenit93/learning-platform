SymbolLookup biến một **symbol name** thành address mà FFM có thể dùng. Kết quả lookup được biểu diễn bằng MemorySegment có địa chỉ của symbol.

~~~java
Linker linker = Linker.nativeLinker();
SymbolLookup lookup = linker.defaultLookup();

MemorySegment strlen = lookup.find("strlen")
        .orElseThrow();
~~~

Các nguồn lookup có phạm vi khác nhau:

- `linker.defaultLookup()` tìm trong tập library thường dùng do linker hiện tại xác định;
- `SymbolLookup.loaderLookup()` tìm symbol trong các native library gắn với class loader của bên gọi;
- `SymbolLookup.libraryLookup(...)` tạo lookup cho một library cụ thể.

Không phải mọi platform đều export cùng symbol trong default lookup. Vì vậy lỗi lookup phải được xem là vấn đề về khả năng/compatibility, không nên fallback sang một address đoán mò.

Sau khi có address, Java vẫn chưa thể call an toàn cho đến khi FunctionDescriptor mô tả đúng signature.
